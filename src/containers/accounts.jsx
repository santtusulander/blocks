import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import * as accountActionCreators from '../redux/modules/account'
import * as metricsActionCreators from '../redux/modules/metrics'
import * as uiActionCreators from '../redux/modules/ui'

import { filterAccountsByUserName, filterMetricsByAccounts } from '../util/helpers'

import ContentItems from '../components/content-items'

export class Accounts extends React.Component {
  constructor(props) {
    super(props);
    this.deleteAccount = this.deleteAccount.bind(this)
    this.sortItems = this.sortItems.bind(this)
  }
  componentWillMount() {
    this.props.fetchData(this.props.metrics, this.props.accounts)
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
      username,
      fetching,
      fetchingMetrics,
      metrics,
      sortDirection,
      sortValuePath,
      viewingChart,
      uiActions } = this.props

    const filteredAccounts = filterAccountsByUserName(accounts, username)
    const filteredMetrics = filterMetricsByAccounts(metrics, filteredAccounts)

    const nextPageURLBuilder = (accountID) => `/content/groups/${brand}/${accountID}`
    const analyticsURLBuilder = (accountID) => `/content/analytics/account/${brand}/${accountID}`
    return (
      <ContentItems
        analyticsURLBuilder={analyticsURLBuilder}
        brand={brand}
        className="groups-container"
        contentItems={filteredAccounts}
        deleteItem={this.deleteGroup}
        fetching={fetching}
        fetchingMetrics={fetchingMetrics}
        headerText={{ summary: 'BRAND CONTENT SUMMARY', label: 'Accounts' }}
        metrics={filteredMetrics}
        nextPageURLBuilder={nextPageURLBuilder}
        sortDirection={sortDirection}
        sortItems={this.sortItems}
        sortValuePath={sortValuePath}
        toggleChartView={uiActions.toggleChartView}
        type='account'
        viewingChart={viewingChart}/>
    )
  }
}

Accounts.displayName = 'Accounts'
Accounts.propTypes = {
  accountActions: React.PropTypes.object,
  accounts: React.PropTypes.instanceOf(Immutable.List),
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  fetchData: React.PropTypes.func,
  fetching: React.PropTypes.bool,
  fetchingMetrics: React.PropTypes.bool,
  metrics: React.PropTypes.instanceOf(Immutable.List),
  metricsActions: React.PropTypes.object,
  params: React.PropTypes.object,
  sortDirection: React.PropTypes.number,
  sortValuePath: React.PropTypes.instanceOf(Immutable.List),
  uiActions: React.PropTypes.object,
  username: React.PropTypes.string,
  viewingChart: React.PropTypes.bool
}
Accounts.defaultProps = {
  accounts: Immutable.List(),
  activeAccount: Immutable.Map(),
  metrics: Immutable.List()
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    accounts: state.account.get('allAccounts'),
    fetching: state.account.get('fetching'),
    fetchingMetrics: state.metrics.get('fetchingAccountMetrics'),
    metrics: state.metrics.get('accountMetrics'),
    sortDirection: state.ui.get('contentItemSortDirection'),
    sortValuePath: state.ui.get('contentItemSortValuePath'),
    viewingChart: state.ui.get('viewingChart'),
    username: state.user.get('username')
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const accountActions = bindActionCreators(accountActionCreators, dispatch)
  const metricsActions = bindActionCreators(metricsActionCreators, dispatch)
  return {
    fetchData: (metrics, accounts) => {
      if(accounts.isEmpty()) {
        accountActions.startFetching()
        accountActions.fetchAccounts(ownProps.params.brand)
      }
      if(metrics.isEmpty()) {
        metricsActions.startAccountFetching()
        metricsActions.fetchAccountMetrics({
          startDate: moment.utc().endOf('hour').add(1,'second').subtract(28, 'days').format('X'),
          endDate: moment.utc().endOf('hour').format('X')
        })
      }
    },
    accountActions: accountActions,
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);
