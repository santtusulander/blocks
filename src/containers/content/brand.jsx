import React, {PropTypes} from 'react'
import { Map, List } from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl';

import {
  getAnalyticsUrlFromParams,
  getContentUrl,
  getDashboardUrl
} from '../../util/routes.js'

import accountActions from '../../redux/modules/entities/accounts/actions'
import { getById as getAccountById, getByBrandWithMetrics  } from '../../redux/modules/entities/accounts/selectors'
import { getGlobalFetching } from '../../redux/modules/fetching/selectors'
import { getAll as getRoles } from '../../redux/modules/entities/roles/selectors'
import { getCurrentUser } from '../../redux/modules/user'

import * as metricsActionCreators from '../../redux/modules/metrics'
import * as uiActionCreators from '../../redux/modules/ui'


import {
  userIsCloudProvider,
  userIsServiceProvider
} from '../../util/helpers'

import ContentItems from '../../components/content/content-items'

import * as PERMISSIONS from '../../constants/permissions'
import { checkUserPermissions } from '../../util/permissions'
import PROVIDER_TYPES from '../../constants/provider-types'
import CONTENT_ITEMS_TYPES from '../../constants/content-items-types'
import { startOfLast28, endOfThisDay } from '../../constants/date-ranges'


export class Brand extends React.Component {
  constructor(props) {
    super(props);
    this.deleteAccount = this.deleteAccount.bind(this)
    this.createAccount = this.createAccount.bind(this)
    this.editAccount = this.editAccount.bind(this)
    this.sortItems = this.sortItems.bind(this)
  }
  componentWillMount() {
    const { fetchData, metrics, accounts, dailyTraffic, currentUser } = this.props;
    fetchData(
      metrics,
      accounts,
      dailyTraffic,
      checkUserPermissions(currentUser, PERMISSIONS.VIEW_CONTENT_ACCOUNTS)
    )
  }
  /* NOTE: id param is needed even if its not used as this function is called with ...arguments - and data needs to be 3rd param */
  createAccount(brand, id, data) {
    return this.props.createAccount({brand, payload: data})
      .then(({ error, payload }) => (
        { item: 'Account', error, payload }
      ))
  }
  editAccount(brand, id, data) {
    return this.props.updateAccount({brand, id, payload: data})
      .then(({ error, payload }) => (
        { item: 'Account', error, payload }
      ))
  }
  deleteAccount(id) {
    const {brand} = this.props.params
    return this.props.removeAccount({brand, id})
      .then(({ error, payload }) => (
        { item: 'Account', error, payload }
      ))
  }
  sortItems(valuePath, direction) {
    this.props.uiActions.sortContentItems({valuePath, direction})
  }

  render() {
    const { brand } = this.props.params
    const {
      activeAccount,
      accounts,
      fetching,
      fetchingMetrics,
      params,
      sortDirection,
      sortValuePath,
      viewingChart,
      currentUser,
      uiActions } = this.props

    // Only UDN admins can see list of all accounts
    const showAccountList = activeAccount && activeAccount.isEmpty() && userIsCloudProvider(currentUser)
    const contentItems = showAccountList
                      ? accounts
                      : List.of(activeAccount)
    const headerTextLabel = showAccountList
                              ? <FormattedMessage id='portal.brand.allAccounts.message'/>
                              : activeAccount.get('name')
    const selectionDisabled = !showAccountList && userIsServiceProvider(currentUser)

    const nextPageURLBuilder = (accountID, account) => {
      if (account.get('provider_type') === PROVIDER_TYPES.CONTENT_PROVIDER) {
        return getContentUrl('groups', accountID, this.props.params)
      } else {
        return getDashboardUrl('account', accountID, this.props.params)
      }
    }
    const analyticsURLBuilder = (...account) => {
      return getAnalyticsUrlFromParams(
        {...this.props.params, account},
        currentUser
      )
    }
    return (
      <ContentItems
        analyticsURLBuilder={analyticsURLBuilder}
        brand={brand}
        params={params}
        changeNotification={uiActions.changeNotification}
        className="groups-container"
        createNewItem={this.createAccount}
        editItem={this.editAccount}
        contentItems={contentItems}
        dailyTraffic={this.props.dailyTraffic}
        deleteItem={this.deleteGroup}
        fetching={fetching}
        fetchingMetrics={fetchingMetrics}
        headerText={{ summary: <FormattedMessage id='portal.brand.summary.message'/>, label: headerTextLabel }}
        isAllowedToConfigure={checkUserPermissions(currentUser, PERMISSIONS.MODIFY_ACCOUNT)}
        nextPageURLBuilder={nextPageURLBuilder}
        selectionDisabled={selectionDisabled}
        showSlices={true}
        sortDirection={sortDirection}
        sortItems={this.sortItems}
        sortValuePath={sortValuePath}
        toggleChartView={uiActions.toggleChartView}
        type={CONTENT_ITEMS_TYPES.ACCOUNT}
        user={currentUser}
        viewingChart={viewingChart}
        fetchItem={(id) => {
          return this.props.fetchAccount({brand, id})
        }}
      />
    )
  }
}

Brand.displayName = 'Brand'
Brand.propTypes = {
  accounts: PropTypes.instanceOf(List),
  activeAccount: PropTypes.instanceOf(Map),
  createAccount: PropTypes.func,
  currentUser: PropTypes.instanceOf(Map),
  dailyTraffic: PropTypes.instanceOf(List),
  fetchAccount: PropTypes.func,
  fetchData: PropTypes.func,
  fetching: PropTypes.bool,
  fetchingMetrics: PropTypes.bool,
  metrics: PropTypes.instanceOf(List),
  params: PropTypes.object,
  removeAccount: PropTypes.func,
  sortDirection: PropTypes.number,
  sortValuePath: PropTypes.instanceOf(List),
  uiActions: PropTypes.object,
  updateAccount: PropTypes.func,
  viewingChart: PropTypes.bool
}

Brand.defaultProps = {
  accounts: List(),
  activeAccount: Map(),
  dailyTraffic: List(),
  currentUser: Map()
}

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {
  return {
    activeAccount: getAccountById(state, ownProps.params.account),
    accounts: getByBrandWithMetrics(state, ownProps.params.brand),
    dailyTraffic: state.metrics.get('accountDailyTraffic'),
    fetching: getGlobalFetching(state),
    fetchingMetrics: state.metrics.get('fetchingAccountMetrics'),
    roles: getRoles(state),
    sortDirection: state.ui.get('contentItemSortDirection'),
    sortValuePath: state.ui.get('contentItemSortValuePath'),
    viewingChart: state.ui.get('viewingChart'),
    currentUser: getCurrentUser(state)
  };
}

/* istanbul ignore next */
const mapDispatchToProps = (dispatch, ownProps) => {

  const {brand, account} = ownProps.params

  const metricsActions = bindActionCreators(metricsActionCreators, dispatch)

  const metricsOpts = {
    startDate: startOfLast28().format('X'),
    endDate: endOfThisDay().format('X')
  }

  return {
    fetchData: (metrics, accounts, dailyTraffic, canListAccounts) => {
      if (!canListAccounts) {
        metricsOpts.account = ownProps.params.account
        metricsOpts.list_children = false
        dispatch(accountActions.fetchOne({brand, id: account}))
      } else {
        metricsOpts.list_children = true
        dispatch(accountActions.fetchAll({brand}))
      }

      metricsActions.startAccountFetching()
      metricsActions.fetchAccountMetrics(metricsOpts)
      // TODO: Replace metrics endpoint with traffic endpoint after 0.7
      // metricsActions.startAccountFetching()
      // metricsActions.fetchHourlyAccountTraffic(metricsOpts)
      //   .then(() => metricsActions.fetchDailyAccountTraffic(metricsOpts))
      metricsActions.fetchDailyAccountTraffic(metricsOpts)
    },
    uiActions: bindActionCreators(uiActionCreators, dispatch),

    createAccount: (params) => dispatch(accountActions.create(params)),
    updateAccount: (params) => dispatch(accountActions.update(params)),
    removeAccount: (params) => dispatch(accountActions.remove(params)),
    fetchAccount: (params) => dispatch(accountActions.fetchOne(params))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Brand);
