import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import { getAnalyticsUrl, getContentUrl } from '../util/routes.js'

import * as accountActionCreators from '../redux/modules/account'
import * as metricsActionCreators from '../redux/modules/metrics'
import * as uiActionCreators from '../redux/modules/ui'

import { filterMetricsByAccounts } from '../util/helpers'

import ContentItems from '../components/content/content-items'

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
    this.props.fetchData(
      this.props.metrics,
      this.props.accounts,
      this.props.dailyTraffic)
  }
  createAccount(brand, data) {
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
      accounts,
      fetching,
      fetchingMetrics,
      metrics,
      sortDirection,
      sortValuePath,
      viewingChart,
      uiActions } = this.props

    const filteredMetrics = filterMetricsByAccounts(metrics, accounts)

    const nextPageURLBuilder = (accountID) => {
      return getContentUrl('account', accountID, this.props.params)
    }
    const analyticsURLBuilder = (...accountID) => {
      return getAnalyticsUrl('account', accountID, this.props.params)
    }
    return (
      <ContentItems
        analyticsURLBuilder={analyticsURLBuilder}
        brand={brand}
        params={this.props.params}
        className="groups-container"
        createNewItem={this.createAccount}
        editItem={this.editAccount}
        contentItems={accounts}
        dailyTraffic={this.props.dailyTraffic}
        deleteItem={this.deleteGroup}
        fetching={fetching}
        fetchingMetrics={fetchingMetrics}
        headerText={{ summary: <FormattedMessage id='portal.brand.summary.message'/>, label: <FormattedMessage id='portal.brand.allAccounts.message'/> }}
        metrics={filteredMetrics}
        nextPageURLBuilder={nextPageURLBuilder}
        sortDirection={sortDirection}
        sortItems={this.sortItems}
        sortValuePath={sortValuePath}
        toggleChartView={uiActions.toggleChartView}
        type='account'
        user={this.props.user}
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
  history: React.PropTypes.object,
  metrics: React.PropTypes.instanceOf(Immutable.List),
  metricsActions: React.PropTypes.object,
  params: React.PropTypes.object,
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
    sortDirection: state.ui.get('contentItemSortDirection'),
    sortValuePath: state.ui.get('contentItemSortValuePath'),
    viewingChart: state.ui.get('viewingChart'),
    user: state.user
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const accountActions = bindActionCreators(accountActionCreators, dispatch)
  const metricsActions = bindActionCreators(metricsActionCreators, dispatch)
  const metricsOpts = {
    startDate: moment.utc().endOf('day').add(1,'second').subtract(28, 'days').format('X'),
    endDate: moment.utc().endOf('day').format('X')
  }
  return {
    fetchData: (metrics, accounts, dailyTraffic) => {
      if(accounts.isEmpty()) {
        accountActions.startFetching()
        accountActions.fetchAccounts(ownProps.params.brand)
      }
      if(metrics.isEmpty()) {
        metricsActions.startAccountFetching()
        metricsActions.fetchAccountMetrics(metricsOpts)
      }
      if(dailyTraffic.isEmpty()) {
        // TODO: Replace metrics endpoint with traffic endpoint after 0.7
        // metricsActions.startAccountFetching()
        // metricsActions.fetchHourlyAccountTraffic(metricsOpts)
        //   .then(() => metricsActions.fetchDailyAccountTraffic(metricsOpts))
        metricsActions.fetchDailyAccountTraffic(metricsOpts)
      }
    },
    accountActions: accountActions,
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);
