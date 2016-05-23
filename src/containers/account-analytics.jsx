import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import * as accountActionCreators from '../redux/modules/account'
import * as metricsActionCreators from '../redux/modules/metrics'
import * as trafficActionCreators from '../redux/modules/traffic'
import * as uiActionCreators from '../redux/modules/ui'
import * as visitorsActionCreators from '../redux/modules/visitors'
import * as reportsActionCreators from '../redux/modules/reports'

import AnalyticsPage from '../components/analysis/analytics-page'
import { filterAccountsByUserName } from '../util/helpers'

export class AccountAnalytics extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dateRange: 'month to date',
      endDate: moment().utc().endOf('day'),
      startDate: moment().utc().startOf('month')
    }
    this.changeDateRange = this.changeDateRange.bind(this)
  }
  componentWillMount() {
    this.fetchData()
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.params.account !== this.props.params.account) {
      this.props.fetchData(nextProps.params.account)
    }
  }
  fetchData(account) {
    this.props.fetchData(
      account || this.props.params.account,
      this.state.startDate,
      this.state.endDate
    )
  }
  changeDateRange(startDate, endDate) {
    const dateRange =
      endDate._d != moment().utc().endOf('day')._d + "" ? 'custom' :
      startDate._d == moment().utc().startOf('month')._d + "" ? 'month to date' :
      startDate._d == moment().utc().startOf('week')._d + "" ? 'week to date' :
      startDate._d == moment().utc().startOf('day')._d + "" ? 'today' :
      'custom'
    this.setState({
      dateRange: dateRange,
      endDate: endDate,
      startDate: startDate
    }, this.fetchData)
  }
  render() {
    const filteredAccounts = filterAccountsByUserName(
      this.props.accounts,
      this.props.username
    )
    const availableAccounts = filteredAccounts.map(account => {
      return {
        active: account.get('id') === this.props.params.account,
        link: `/content/analytics/account/${this.props.params.brand}/${account.get('id')}`,
        name: account.get('name')
      }
    })
    // TODO: This should have its own endpoint so we don't have to fetch info
    // for all accounts
    const metrics = this.props.metrics.find(metric => metric.get('account') + "" === this.props.params.account) || Immutable.Map()
    const activeName = this.props.activeAccount ? this.props.activeAccount.get('name') : ''

    return (
      <AnalyticsPage
        activeName={activeName}
        changeDateRange={this.changeDateRange}
        changeSPChartType={this.props.uiActions.changeSPChartType}
        dateRange={this.state.dateRange}
        endDate={this.state.endDate}
        exportFilenamePart={`${activeName} - ${moment().format()}`}
        fetchingMetrics={this.props.fetchingMetrics}
        fileErrorSummary={this.props.fileErrorSummary}
        fileErrorURLs={this.props.fileErrorURLs}
        metrics={metrics}
        onOffNet={this.props.onOffNet}
        onOffNetToday={this.props.onOffNetToday}
        reportsFetching={this.props.reportsFetching}
        serviceTypes={this.props.serviceTypes}
        siblings={availableAccounts}
        spChartType={this.props.spChartType}
        startDate={this.state.startDate}
        storageStats={this.props.storageStats}
        toggleAnalysisServiceType={this.props.uiActions.toggleAnalysisServiceType}
        totalEgress={this.props.totalEgress}
        trafficByCountry={this.props.trafficByCountry}
        trafficByTime={this.props.trafficByTime}
        trafficFetching={this.props.trafficFetching}
        type="account"
        urlMetrics={this.props.urlMetrics}
        visitorsByBrowser={this.props.visitorsByBrowser}
        visitorsByCountry={this.props.visitorsByCountry}
        visitorsByOS={this.props.visitorsByOS}
        visitorsByTime={this.props.visitorsByTime}
        visitorsFetching={this.props.visitorsFetching}/>
    )
  }
}

AccountAnalytics.displayName = 'AccountAnalytics'
AccountAnalytics.propTypes = {
  accounts: React.PropTypes.instanceOf(Immutable.List),
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  fetchData: React.PropTypes.func,
  fetchingMetrics: React.PropTypes.bool,
  fileErrorSummary: React.PropTypes.instanceOf(Immutable.Map),
  fileErrorURLs: React.PropTypes.instanceOf(Immutable.List),
  metrics: React.PropTypes.instanceOf(Immutable.List),
  onOffNet: React.PropTypes.instanceOf(Immutable.Map),
  onOffNetToday: React.PropTypes.instanceOf(Immutable.Map),
  params: React.PropTypes.object,
  reportsFetching: React.PropTypes.bool,
  serviceTypes: React.PropTypes.instanceOf(Immutable.List),
  spChartType: React.PropTypes.string,
  storageStats: React.PropTypes.instanceOf(Immutable.List),
  totalEgress: React.PropTypes.number,
  trafficByCountry: React.PropTypes.instanceOf(Immutable.List),
  trafficByTime: React.PropTypes.instanceOf(Immutable.List),
  trafficFetching: React.PropTypes.bool,
  uiActions: React.PropTypes.object,
  urlMetrics: React.PropTypes.instanceOf(Immutable.List),
  username: React.PropTypes.string,
  visitorsByBrowser: React.PropTypes.instanceOf(Immutable.Map),
  visitorsByCountry: React.PropTypes.instanceOf(Immutable.Map),
  visitorsByOS: React.PropTypes.instanceOf(Immutable.Map),
  visitorsByTime: React.PropTypes.instanceOf(Immutable.List),
  visitorsFetching: React.PropTypes.bool
}

function mapStateToProps(state) {
  return {
    accounts: state.account.get('allAccounts'),
    activeAccount: state.account.get('activeAccount'),
    fetchingMetrics: state.metrics.get('fetchingAccountMetrics'),
    fileErrorSummary: state.reports.get('fileErrorSummary'),
    fileErrorURLs: state.reports.get('fileErrorURLs'),
    metrics: state.metrics.get('accountMetrics'),
    totalEgress: state.traffic.get('totalEgress'),
    serviceTypes: state.ui.get('analysisServiceTypes'),
    spChartType: state.ui.get('analysisSPChartType'),
    storageStats: state.traffic.get('storage'),
    onOffNet: state.traffic.get('onOffNet'),
    onOffNetToday: state.traffic.get('onOffNetToday'),
    reportsFetching: state.reports.get('fetching'),
    trafficByCountry: state.traffic.get('byCountry'),
    trafficByTime: state.traffic.get('byTime'),
    trafficFetching: state.traffic.get('fetching'),
    urlMetrics: state.reports.get('urlMetrics'),
    username: state.user.get('username'),
    visitorsByBrowser: state.visitors.get('byBrowser'),
    visitorsByCountry: state.visitors.get('byCountry'),
    visitorsByOS: state.visitors.get('byOS'),
    visitorsByTime: state.visitors.get('byTime'),
    visitorsFetching: state.visitors.get('fetching')
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const accountActions = bindActionCreators(accountActionCreators, dispatch)
  const metricsActions = bindActionCreators(metricsActionCreators, dispatch)
  const reportsActions = bindActionCreators(reportsActionCreators, dispatch)
  const trafficActions = bindActionCreators(trafficActionCreators, dispatch)
  const visitorsActions = bindActionCreators(visitorsActionCreators, dispatch)

  function fetchData (account, start, end) {
    const fetchOpts = {
      account: account,
      startDate: start.format('X'),
      endDate: end.format('X')
    }
    const onOffOpts = Object.assign({}, fetchOpts)
    onOffOpts.granularity = 'day'
    const onOffTodayOpts = Object.assign({}, onOffOpts)
    onOffTodayOpts.startDate = moment().utc().startOf('day').format('X'),
    onOffTodayOpts.endDate = moment().utc().format('X')
    trafficActions.startFetching()
    visitorsActions.startFetching()
    reportsActions.startFetching()
    accountActions.fetchAccount(
      ownProps.params.brand,
      account
    )
    metricsActions.startAccountFetching()
    Promise.all([
      metricsActions.fetchAccountMetrics({
        startDate: start.format('X'),
        endDate: end.format('X')
      })
    ]).then(metricsActions.finishFetching)
    Promise.all([
      trafficActions.fetchByTime(fetchOpts),
      trafficActions.fetchByCountry(fetchOpts),
      trafficActions.fetchTotalEgress(fetchOpts),
      trafficActions.fetchOnOffNet(onOffOpts),
      trafficActions.fetchOnOffNetToday(onOffTodayOpts),
      trafficActions.fetchStorage()
    ]).then(trafficActions.finishFetching)
    Promise.all([
      visitorsActions.fetchByTime(fetchOpts),
      visitorsActions.fetchByCountry(fetchOpts),
      visitorsActions.fetchByBrowser(fetchOpts),
      visitorsActions.fetchByOS(fetchOpts)
    ]).then(visitorsActions.finishFetching)
    Promise.all([
      reportsActions.fetchFileErrorsMetrics(fetchOpts),
      reportsActions.fetchURLMetrics(fetchOpts)
    ]).then(reportsActions.finishFetching)
  }

  return {
    fetchData: fetchData,
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountAnalytics);
