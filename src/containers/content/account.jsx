import React, {PropTypes} from 'react'
import { Map, List} from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {
  getAnalyticsUrlFromParams,
  getContentUrl,
  getNetworkUrl
} from '../../util/routes.js'
import {
  accountIsServiceProviderType,
  userIsServiceProvider
} from '../../util/helpers.js'

import {
  DELETE_GROUP
} from '../../constants/account-management-modals.js'

import accountActions from '../../redux/modules/entities/accounts/actions'
import groupActions from '../../redux/modules/entities/groups/actions'

import { getById as getAccountById } from '../../redux/modules/entities/accounts/selectors'
import { getByAccountWithMetrics as getGroupsByAccountWithMetrics } from '../../redux/modules/entities/groups/selectors'
import { getGlobalFetching } from '../../redux/modules/fetching/selectors'

import { getCurrentUser } from '../../redux/modules/user'

import * as metricsActionCreators from '../../redux/modules/metrics'
import * as uiActionCreators from '../../redux/modules/ui'

import { parseResponseError } from '../../redux/util'

//TODO: UDNP-3177 Remove when fetchItem is not needed anymore
import * as groupActionCreators from '../../redux/modules/group'

import PROVIDER_TYPES from '../../constants/provider-types'

import Content from '../../components/shared/layout/content'
import ModalWindow from '../../components/shared/modal'
import ContentItems from '../../components/content/content-items'

import * as PERMISSIONS from '../../constants/permissions'
import CONTENT_ITEMS_TYPES from '../../constants/content-items-types'
import { checkUserPermissions, getLocationPermissions } from '../../util/permissions'

import { FormattedMessage, injectIntl } from 'react-intl'
import { UDN_CORE_ACCOUNT_ID } from '../../constants/account-management-options'
import { startOfLast28, endOfThisDay } from '../../constants/date-ranges'

export class Account extends React.Component {
  constructor(props) {
    super(props)

    this.createGroup = this.createGroup.bind(this)
    this.editGroup = this.editGroup.bind(this)
    this.deleteGroup = this.deleteGroup.bind(this)
    this.sortItems = this.sortItems.bind(this)
    this.showDeleteGroupModal = this.showDeleteGroupModal.bind(this)

    this.notificationTimeout = null

    this.state = {
      groupToDelete: null
    }
  }
  componentWillMount() {
    this.props.fetchData()
  }

  /* TODO: UDNP-3177 Move all CRUD methods inside GroupModal */
  /* eslint-disable no-console */
  createGroup({data /*, usersToAdd*/ }) {
    //console.warn( 'createGroup in account.jsx will be deprecated and moved to GroupFormContainer')
    const {brand, account} = this.props.params

    return this.props.createGroup({brand, account, payload: data})
      .then(({ error, payload }) => ({ item: 'Group', error, payload }))
      //TODO: Should we support adding users to group`?
      //.then(({ payload }) => {
      //   return Promise.all(usersToAdd.map(email => {
      //     const foundUser = this.props.user.get('allUsers')
      //       .find(user => user.get('email') === email)
      //     const newUser = {
      //       group_id: foundUser.get('group_id').push(payload.id).toJS()
      //     }
      //     return this.props.updateUser(email, newUser)
      //   }))
      //   .then(() => ({ item: 'Group', name: data.name }))
      // })
  }

  editGroup({groupId, data /*, addUsers, deleteUsers */ }) {
    //console.warn( 'editGroup in account.jsx will be deprecated and moved to GroupFormContainer')

    const {brand, account} = this.props.params

    return this.props.updateGroup({brand, account, id: groupId, payload: data})
      .then(({ error, payload }) => (
        { item: 'Group', error, payload }
      ))
    // TODO: Should we support users in groups?
    // const groupIdsByEmail = email => this.props.user.get('allUsers')
    //   .find(user => user.get('email') === email)
    //   .get('group_id')
    // const addUserActions = addUsers.map(email => {
    //   return this.props.updateUser(email, {
    //     group_id: groupIdsByEmail(email).push(groupId).toJS()
    //   })
    // })
    // const deleteUserActions = deleteUsers.map(email => {
    //   return this.props.updateUser(email, {
    //     group_id: groupIdsByEmail(email).filter(id => id !== groupId).toJS()
    //   })
    // })
    // return Promise.all([
    //   this.props.groupActions.updateGroup(
    //     'udn',
    //     this.props.activeAccount.get('id'),
    //     groupId,
    //     data
    //   ),
    //   ...addUserActions,
    //   ...deleteUserActions
    // ]).then(({ error, payload }) => (
    //   { item: 'Group', name: data.name, error, payload }
    // ))
  }
  deleteGroup(group) {
    //console.warn( 'deleteGroup in account.jsx will be deprecated and moved to GroupFormContainer')

    const {brand, account} = this.props.params
    const id = group.get('id')

    return this.props.removeGroup({brand, account, id})
      .then(() => {
        this.props.toggleDeleteConfirmationModal(null)
        this.showNotification(<FormattedMessage id="portal.accountManagement.groupDeleted.text"/>)
      })
      .catch((response) => {
        this.props.toggleDeleteConfirmationModal(null)
        this.props.uiActions.showInfoDialog({
          title: <FormattedMessage id="portal.errorModal.error.text"/>,
          content: parseResponseError(response.payload),
          okButton: true,
          cancel: () => this.props.uiActions.hideInfoDialog()
        })
      })
  }

  //TODO: Refactor to Global confirmation dialog action
  showDeleteGroupModal(group) {
    this.setState({ groupToDelete: group });

    this.props.toggleDeleteConfirmationModal(DELETE_GROUP)

    return Promise.resolve({})
  }

  //TODO: Refactor to global notification action
  showNotification(message) {
    clearTimeout(this.notificationTimeout)
    this.props.uiActions.changeNotification(message)
    this.notificationTimeout = setTimeout(this.props.uiActions.changeNotification, 10000)
  }

  sortItems(valuePath, direction) {
    this.props.uiActions.sortContentItems({valuePath, direction})
  }
  render() {

    const { brand, account } = this.props.params
    const { accountManagementModal, activeAccount, activeGroup, currentUser } = this.props

    const nextPageURLBuilder = (groupID) => {
      if ((activeAccount.get('provider_type') === PROVIDER_TYPES.CONTENT_PROVIDER) || (activeAccount.get('id') === UDN_CORE_ACCOUNT_ID)) {
        return getContentUrl('group', groupID, this.props.params)
      } else {
        return getNetworkUrl('group', groupID, this.props.params)
      }
    }
    const analyticsURLBuilder = (group) => {
      return getAnalyticsUrlFromParams(
        {...this.props.params, group},
        currentUser,
      )
    }

    const breadcrumbs = [{ label: activeAccount ? activeAccount.get('name') : <FormattedMessage id="portal.loading.text"/> }]
    const headerText = activeAccount && activeAccount.get('provider_type') === PROVIDER_TYPES.SERVICE_PROVIDER ? <FormattedMessage id="portal.groups.accountSummary.text"/> : <FormattedMessage id="portal.groups.accountContentSummary.text"/>
    const selectionDisabled = userIsServiceProvider(currentUser) || accountIsServiceProviderType(activeAccount)

    let deleteModalProps = null
    switch (accountManagementModal) {
      case DELETE_GROUP:
        deleteModalProps = {
          title: <FormattedMessage id="portal.deleteModal.header.text" values={{itemToDelete: this.state.groupToDelete.get('name')}}/>,
          content: <FormattedMessage id="portal.accountManagement.deleteGroupConfirmation.text"/>,
          verifyDelete: true,
          cancelButton: true,
          deleteButton: true,
          cancel: () => this.props.toggleDeleteConfirmationModal(null),
          onSubmit: () => this.deleteGroup(this.state.groupToDelete)
        }
        break
    }

    return (
      <Content>
        <ContentItems
          activeAccount={activeAccount}
          activeGroup={activeGroup}
          analyticsURLBuilder={analyticsURLBuilder}
          brand={brand}
          params={this.props.params}
          className="groups-container"
          contentItems={this.props.groups}
          changeNotification={this.props.uiActions.changeNotification}
          dailyTraffic={this.props.dailyTraffic}
          createNewItem={this.createGroup}
          editItem={this.editGroup}
          deleteItem={this.showDeleteGroupModal}
          fetching={this.props.fetching}
          fetchingMetrics={this.props.fetchingMetrics}
          headerText={{ summary: headerText, label: breadcrumbs[0].label }}
          ifNoContent={activeAccount ? `${activeAccount.get('name')} contains no groups` : <FormattedMessage id="portal.loading.text"/>}
          isAllowedToConfigure={checkUserPermissions(currentUser, PERMISSIONS.MODIFY_GROUP)}
          locationPermissions={getLocationPermissions(currentUser)}
          nextPageURLBuilder={nextPageURLBuilder}
          selectionStartTier="group"
          selectionDisabled={selectionDisabled}
          showAnalyticsLink={true}
          showSlices={true}
          sortDirection={this.props.sortDirection}
          sortItems={this.sortItems}
          sortValuePath={this.props.sortValuePath}
          toggleChartView={this.props.uiActions.toggleChartView}
          type={CONTENT_ITEMS_TYPES.GROUP}
          user={this.props.user}
          viewingChart={this.props.viewingChart}
          fetchItem={(id) => {
            console.warn('UDNP-3177 fetchItem will be deprecated')
            return this.props.oldGroupActions.fetchGroup(brand, account, id)
          }}
        />

        {deleteModalProps && <ModalWindow {...deleteModalProps}/>}

      </Content>
    )
  }
}

Account.displayName = 'Account'
Account.propTypes = {
  accountManagementModal: PropTypes.string,
  activeAccount: PropTypes.instanceOf(Map),
  activeGroup: PropTypes.instanceOf(Map),
  createGroup: PropTypes.func,
  currentUser: PropTypes.instanceOf(Map),
  dailyTraffic: PropTypes.instanceOf(List),
  fetchData: PropTypes.func,
  fetching: PropTypes.bool,
  fetchingMetrics: PropTypes.bool,
  groups: PropTypes.instanceOf(List),
  oldGroupActions: PropTypes.object,
  params: PropTypes.object,
  removeGroup: PropTypes.func,
  sortDirection: PropTypes.number,
  sortValuePath: PropTypes.instanceOf(List),
  toggleDeleteConfirmationModal: PropTypes.func,
  uiActions: PropTypes.object,
  updateGroup: PropTypes.func,
  user: PropTypes.instanceOf(Map),
  viewingChart: PropTypes.bool
}

Account.defaultProps = {
  activeAccount: Map(),
  activeGroup: Map(),
  dailyTraffic: List(),
  groups: List(),
  sortValuePath: List(),
  user: Map()
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {
  const {account} = ownProps.params

  return {
    accountManagementModal: state.ui.get('accountManagementModal'),
    activeAccount: getAccountById(state, account),

    currentUser: getCurrentUser(state),

    dailyTraffic: state.metrics.get('groupDailyTraffic'),
    fetching: getGlobalFetching(state),
    fetchingMetrics: state.metrics.get('fetchingGroupMetrics'),
    groups: getGroupsByAccountWithMetrics(state, account),

    sortDirection: state.ui.get('contentItemSortDirection'),
    sortValuePath: state.ui.get('contentItemSortValuePath'),
    user: state.user,
    viewingChart: state.ui.get('viewingChart')
  };
}

/* istanbul ignore next */
const mapDispatchToProps = (dispatch, ownProps) => {
  const { brand, account } = ownProps.params

  const metricsActions = bindActionCreators(metricsActionCreators, dispatch)
  const uiActions = bindActionCreators(uiActionCreators, dispatch)

  //TODO: UDNP-3177 Remove when fetchItem is not needed anymore
  const oldGroupActions = bindActionCreators(groupActionCreators, dispatch)

  const metricsOpts = {
    account: account,
    startDate: startOfLast28().format('X'),
    endDate: endOfThisDay().format('X')
  }
  const fetchData = () => {
    return Promise.all([
      dispatch(accountActions.fetchOne({brand, id: account})),
      dispatch(groupActions.fetchAll({brand, account})),

      metricsActions.startGroupFetching(),
      metricsActions.fetchGroupMetrics(metricsOpts),
      metricsActions.fetchDailyGroupTraffic(metricsOpts)
    ])
  }

  return {
    fetchData: fetchData,
    uiActions,
    oldGroupActions,
    toggleDeleteConfirmationModal: uiActions.toggleAccountManagementModal,
    createGroup: (params) => dispatch(groupActions.create(params)),
    updateGroup: (params) => dispatch(groupActions.update(params)),
    removeGroup: (params) => dispatch(groupActions.remove(params))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Account));
