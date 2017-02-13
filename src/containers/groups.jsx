import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import {
  getAnalyticsUrlFromParams,
  getContentUrl,
  getNetworkUrl
} from '../util/routes.js'
import {
  accountIsServiceProviderType,
  userIsServiceProvider
} from '../util/helpers.js'

import {
  DELETE_GROUP
} from '../constants/account-management-modals.js'

import { fetchUsers, updateUser } from '../redux/modules/user'
import * as accountActionCreators from '../redux/modules/account'
import { clearFetchedHosts } from '../redux/modules/host'
import * as groupActionCreators from '../redux/modules/group'
import * as metricsActionCreators from '../redux/modules/metrics'
import * as uiActionCreators from '../redux/modules/ui'
import PROVIDER_TYPES from '../constants/provider-types'

import Content from '../components/layout/content'
import ModalWindow from '../components/modal'
import ContentItems from '../components/content/content-items'

import * as PERMISSIONS from '../constants/permissions'
import CONTENT_ITEMS_TYPES from '../constants/content-items-types'
import checkPermissions from '../util/permissions'

import { FormattedMessage, injectIntl } from 'react-intl'

export class Groups extends React.Component {
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
    /* FIXME: This is not the right way of deciding when to fetch - causes sometimes 'No Groups found' - error
     * temp fix for bug: commented out condition to fetch always. Maybe we should cache the data and fetch from server only if needed?
     **/
    //if(!this.props.activeAccount || String(this.props.activeAccount.get('id')) !== this.props.params.account) {
    if (checkPermissions(this.props.roles, this.props.user.get('currentUser'), PERMISSIONS.CREATE_GROUP)) {
      this.props.fetchUsers()
    }
    this.props.fetchData()
    //}
  }
  createGroup({data, usersToAdd}) {
    return this.props.groupActions.createGroup('udn', this.props.params.account, data)
      .then(({ payload }) => {
        this.props.clearFetchedHosts()
        return Promise.all(usersToAdd.map(email => {
          const foundUser = this.props.user.get('allUsers')
            .find(user => user.get('email') === email)
          const newUser = {
            group_id: foundUser.get('group_id').push(payload.id).toJS()
          }
          return this.props.updateUser(email, newUser)
        }))
        .then(() => ({ item: 'Group', name: data.name }))
      })
  }
  editGroup({groupId, data, addUsers, deleteUsers}) {
    const groupIdsByEmail = email => this.props.user.get('allUsers')
      .find(user => user.get('email') === email)
      .get('group_id')
    const addUserActions = addUsers.map(email => {
      return this.props.updateUser(email, {
        group_id: groupIdsByEmail(email).push(groupId).toJS()
      })
    })
    const deleteUserActions = deleteUsers.map(email => {
      return this.props.updateUser(email, {
        group_id: groupIdsByEmail(email).filter(id => id !== groupId).toJS()
      })
    })
    return Promise.all([
      this.props.groupActions.updateGroup(
        'udn',
        this.props.activeAccount.get('id'),
        groupId,
        data
      ),
      ...addUserActions,
      ...deleteUserActions
    ]).then(({ error, payload }) => (
      { item: 'Group', name: data.name, error, payload }
    ))
  }
  deleteGroup(group) {
    return this.props.groupActions.deleteGroup(
      'udn',
      this.props.activeAccount.get('id'),
      group.get('id')
    ).then(response => {
      this.props.toggleDeleteConfirmationModal(null)
      this.showNotification(<FormattedMessage id="portal.accountManagement.groupDeleted.text"/>)
      response.error &&
        this.props.uiActions.showInfoDialog({
          title: 'Error',
          content: response.payload.data.message,
          okButton: true,
          cancel: () => this.props.uiActions.hideInfoDialog()
        })
    })
  }

  showDeleteGroupModal(group) {
    this.setState({ groupToDelete: group });

    this.props.toggleDeleteConfirmationModal(DELETE_GROUP)

    return Promise.resolve({})
  }

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
    const { accountManagementModal, activeAccount, activeGroup, roles, user } = this.props

    const nextPageURLBuilder = (groupID) => {
      if (activeAccount.get('provider_type') === PROVIDER_TYPES.CONTENT_PROVIDER) {
        return getContentUrl('group', groupID, this.props.params)
      } else {
        return getNetworkUrl('group', groupID, this.props.params)
      }
    }
    const analyticsURLBuilder = (group) => {
      return getAnalyticsUrlFromParams(
        {...this.props.params, group},
        user.get('currentUser'),
        roles
      )
    }

    const breadcrumbs = [{ label: activeAccount ? activeAccount.get('name') : <FormattedMessage id="portal.loading.text"/> }]
    const headerText = activeAccount && activeAccount.get('provider_type') === PROVIDER_TYPES.SERVICE_PROVIDER ? <FormattedMessage id="portal.groups.accountSummary.text"/> : <FormattedMessage id="portal.groups.accountContentSummary.text"/>
    const currentUser = user.get('currentUser')
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
          isAllowedToConfigure={checkPermissions(this.props.roles, this.props.user.get('currentUser'), PERMISSIONS.MODIFY_GROUP)}
          metrics={this.props.metrics}
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
          fetchItem={(id) => { return this.props.groupActions.fetchGroup(brand, account, id) }}
        />

        {deleteModalProps && <ModalWindow {...deleteModalProps}/>}

      </Content>
    )
  }
}

Groups.displayName = 'Groups'
Groups.propTypes = {
  accountManagementModal: React.PropTypes.string,
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  clearFetchedHosts: React.PropTypes.func,
  dailyTraffic: React.PropTypes.instanceOf(Immutable.List),
  fetchData: React.PropTypes.func,
  fetchUsers: React.PropTypes.func,
  fetching: React.PropTypes.bool,
  fetchingMetrics: React.PropTypes.bool,
  groupActions: React.PropTypes.object,
  groups: React.PropTypes.instanceOf(Immutable.List),
  metrics: React.PropTypes.instanceOf(Immutable.List),
  params: React.PropTypes.object,
  roles: React.PropTypes.instanceOf(Immutable.List),
  sortDirection: React.PropTypes.number,
  sortValuePath: React.PropTypes.instanceOf(Immutable.List),
  toggleDeleteConfirmationModal: React.PropTypes.func,
  uiActions: React.PropTypes.object,
  updateUser: React.PropTypes.func,
  user: React.PropTypes.instanceOf(Immutable.Map),
  viewingChart: React.PropTypes.bool
}
Groups.defaultProps = {
  activeAccount: Immutable.Map(),
  activeGroup: Immutable.Map(),
  dailyTraffic: Immutable.List(),
  groups: Immutable.List(),
  metrics: Immutable.List(),
  roles: Immutable.List(),
  sortValuePath: Immutable.List(),
  user: Immutable.Map()
}

function mapStateToProps(state) {
  return {
    accountManagementModal: state.ui.get('accountManagementModal'),
    activeAccount: state.account.get('activeAccount'),
    activeGroup: state.group.get('activeGroup'),
    dailyTraffic: state.metrics.get('groupDailyTraffic'),
    fetching: state.group.get('fetching'),
    fetchingMetrics: state.metrics.get('fetchingGroupMetrics'),
    groups: state.group.get('allGroups'),
    metrics: state.metrics.get('groupMetrics'),
    roles: state.roles.get('roles'),
    sortDirection: state.ui.get('contentItemSortDirection'),
    sortValuePath: state.ui.get('contentItemSortValuePath'),
    user: state.user,
    viewingChart: state.ui.get('viewingChart')
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const {brand, account} = ownProps.params
  const accountActions = bindActionCreators(accountActionCreators, dispatch)
  const groupActions = bindActionCreators(groupActionCreators, dispatch)
  const metricsActions = bindActionCreators(metricsActionCreators, dispatch)
  const uiActions = bindActionCreators(uiActionCreators, dispatch)
  const metricsOpts = {
    account: account,
    startDate: moment.utc().endOf('day').add(1,'second').subtract(28, 'days').format('X'),
    endDate: moment.utc().endOf('day').format('X')
  }
  const fetchData = () => {
    accountActions.fetchAccount(brand, account)
    groupActions.startFetching()
    metricsActions.startGroupFetching()
    groupActions.fetchGroups(brand, account)
    metricsActions.fetchGroupMetrics(metricsOpts)
    metricsActions.fetchDailyGroupTraffic(metricsOpts)
  }
  return {
    fetchData: fetchData,
    groupActions: groupActions,
    clearFetchedHosts: () => dispatch(clearFetchedHosts()),
    fetchUsers: () => dispatch(fetchUsers(brand, account)),
    updateUser: (email, newUser) => dispatch(updateUser(email, newUser)),
    uiActions,
    toggleDeleteConfirmationModal: uiActions.toggleAccountManagementModal
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Groups));
