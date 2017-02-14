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

import * as accountActionCreators from '../redux/modules/account'
import * as metricsActionCreators from '../redux/modules/metrics'
import * as uiActionCreators from '../redux/modules/ui'

import {
  filterMetricsByAccounts,
  userIsCloudProvider,
  userIsServiceProvider
} from '../util/helpers'

import ContentItems from '../components/content/content-items'

import * as PERMISSIONS from '../constants/permissions'
import checkPermissions from '../util/permissions'
import PROVIDER_TYPES from '../constants/provider-types'
import CONTENT_ITEMS_TYPES from '../constants/content-items-types'

import { FormattedMessage } from 'react-intl';

export class Accounts extends React.Component {
  constructor(props) {
    super(props);
    this.deleteAccount = this.deleteAccount.bind(this)
    this.createAccount = this.createAccount.bind(this)
    this.editAccount = this.editAccount.bind(this)
    this.sortItems = this.sortItems.bind(this)
  }
  componentWillMount() {
    const { fetchData, metrics, accounts, dailyTraffic, roles, user } = this.props;
    fetchData(
      metrics,
      accounts,
      dailyTraffic,
      checkPermissions(roles, user.get('currentUser'), PERMISSIONS.VIEW_CONTENT_ACCOUNTS)
    )
  }
  /* NOTE: id param is needed even if its not used as this function is called with ...arguments - and data needs to be 3rd param */
  createAccount(brand, id, data) {
    return this.props.accountActions.createAccount(brand, data)
  }
  editAccount(brand, id, data) {
    return this.props.accountActions.updateAccount(brand, id, data)
  }
  deleteAccount(id) {
    this.props.accountActions.deleteAccount(this.props.params.brand, id)
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
      metrics,
      params,
      roles,
      sortDirection,
      sortValuePath,
      viewingChart,
      user,
      uiActions } = this.props

    // Only UDN admins can see list of all accounts
    const currentUser = user.get('currentUser')
    const showAccountList = activeAccount.isEmpty() && userIsCloudProvider(currentUser)
    const contentItems = showAccountList
                      ? accounts
                      : Immutable.List.of(activeAccount)
    const headerTextLabel = showAccountList
                              ? <FormattedMessage id='portal.brand.allAccounts.message'/>
                              : activeAccount.get('name')
    const selectionDisabled = !showAccountList && userIsServiceProvider(currentUser)

    const filteredMetrics = filterMetricsByAccounts(metrics, contentItems)

    const nextPageURLBuilder = (accountID, account) => {
      if (account.get('provider_type') === PROVIDER_TYPES.CONTENT_PROVIDER) {
        return getContentUrl('groups', accountID, this.props.params)
      } else {
        return getNetworkUrl('groups', accountID, this.props.params)
      }
    }
    const analyticsURLBuilder = (...account) => {
      return getAnalyticsUrlFromParams(
        {...this.props.params, account},
        user.get('currentUser'),
        roles
      )
    }
    return (
      <ContentItems
        analyticsURLBuilder={analyticsURLBuilder}
        brand={brand}
        params={params}
        className="groups-container"
        createNewItem={this.createAccount}
        editItem={this.editAccount}
        contentItems={contentItems}
        dailyTraffic={this.props.dailyTraffic}
        deleteItem={this.deleteGroup}
        fetching={fetching}
        fetchingMetrics={fetchingMetrics}
        headerText={{ summary: <FormattedMessage id='portal.brand.summary.message'/>, label: headerTextLabel }}
        isAllowedToConfigure={checkPermissions(roles, currentUser, PERMISSIONS.MODIFY_ACCOUNTS)}
        metrics={filteredMetrics}
        nextPageURLBuilder={nextPageURLBuilder}
        selectionDisabled={selectionDisabled}
        showSlices={true}
        sortDirection={sortDirection}
        sortItems={this.sortItems}
        sortValuePath={sortValuePath}
        toggleChartView={uiActions.toggleChartView}
        type={CONTENT_ITEMS_TYPES.ACCOUNT}
        user={user}
        viewingChart={viewingChart}
        fetchItem={(id) => { return this.props.accountActions.fetchAccount(brand, id) }}
      />
    )
  }
}

Accounts.displayName = 'Accounts'
Accounts.propTypes = {
  accountActions: React.PropTypes.object,
  accounts: React.PropTypes.instanceOf(Immutable.List),
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  dailyTraffic: React.PropTypes.instanceOf(Immutable.List),
  fetchData: React.PropTypes.func,
  fetching: React.PropTypes.bool,
  fetchingMetrics: React.PropTypes.bool,
  metrics: React.PropTypes.instanceOf(Immutable.List),
  params: React.PropTypes.object,
  roles: React.PropTypes.instanceOf(Immutable.List),
  sortDirection: React.PropTypes.number,
  sortValuePath: React.PropTypes.instanceOf(Immutable.List),
  uiActions: React.PropTypes.object,
  user: React.PropTypes.instanceOf(Immutable.Map),
  viewingChart: React.PropTypes.bool
}
Accounts.defaultProps = {
  accounts: Immutable.List(),
  activeAccount: Immutable.Map(),
  dailyTraffic: Immutable.List(),
  metrics: Immutable.List(),
  roles: Immutable.List(),
  user: Immutable.Map()
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    accounts: state.account.get('allAccounts'),
    dailyTraffic: state.metrics.get('accountDailyTraffic'),
    fetching: state.account.get('fetching'),
    fetchingMetrics: state.metrics.get('fetchingAccountMetrics'),
    metrics: state.metrics.get('accountMetrics'),
    roles: state.roles.get('roles'),
    sortDirection: state.ui.get('contentItemSortDirection'),
    sortValuePath: state.ui.get('contentItemSortValuePath'),
    viewingChart: state.ui.get('viewingChart'),
    user: state.user
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const accountActions = bindActionCreators(accountActionCreators, dispatch)
  const metricsActions = bindActionCreators(metricsActionCreators, dispatch)
  let metricsOpts = {
    startDate: moment.utc().endOf('day').add(1,'second').subtract(28, 'days').format('X'),
    endDate: moment.utc().endOf('day').format('X')
  }

  return {
    fetchData: (metrics, accounts, dailyTraffic, canListAccounts) => {
      if (!canListAccounts) {
        metricsOpts.account = ownProps.params.account;
      }
      metricsOpts.list_children = !!canListAccounts;
      if(accounts.isEmpty() && canListAccounts) {
        accountActions.startFetching()
        accountActions.fetchAccounts(ownProps.params.brand)
      }
      metricsActions.startAccountFetching()
      metricsActions.fetchAccountMetrics(metricsOpts)
      // TODO: Replace metrics endpoint with traffic endpoint after 0.7
      // metricsActions.startAccountFetching()
      // metricsActions.fetchHourlyAccountTraffic(metricsOpts)
      //   .then(() => metricsActions.fetchDailyAccountTraffic(metricsOpts))
      metricsActions.fetchDailyAccountTraffic(metricsOpts)
    },
    accountActions: accountActions,
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);
