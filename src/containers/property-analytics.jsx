import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import moment from 'moment'

import * as accountActionCreators from '../redux/modules/account'
import * as groupActionCreators from '../redux/modules/group'
import * as hostActionCreators from '../redux/modules/host'
import * as metricsActionCreators from '../redux/modules/metrics'
import * as trafficActionCreators from '../redux/modules/traffic'
import * as uiActionCreators from '../redux/modules/ui'
import * as visitorsActionCreators from '../redux/modules/visitors'
import * as reportsActionCreators from '../redux/modules/reports'
import * as exportsActionCreators from '../redux/modules/exports';

import AnalyticsPage from '../components/analysis/analytics-page'

export class PropertyAnalytics extends React.Component {
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
    this.props.fetchInit()
    this.fetchData()
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.serviceTypes !== this.props.serviceTypes) {
      this.fetchData(nextProps.location.query.name, nextProps.serviceTypes)
    }
    if(nextProps.location.query.name !== this.props.location.query.name) {
      this.fetchData(nextProps.location.query.name)
    }
  }
  fetchData(property, serviceTypes) {

    this.props.fetchData(
      property || this.props.location.query.name,
      this.state.startDate,
      this.state.endDate,
      serviceTypes || this.props.serviceTypes
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
    const propertyName = this.props.location.query.name
    const availableHosts = this.props.hosts.map(host => {
      return {
        active: host === propertyName,
        link: `/content/analytics/property/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${encodeURIComponent(host).replace(/\./g, "%2e")}`,
        name: host
      }
    })
    // TODO: This should have its own endpoint so we don't have to fetch info
    // for all accounts
    const metrics = this.props.metrics.find(metric => metric.get('property') + "" === propertyName) || Immutable.Map()
    const activeAccountName = this.props.activeAccount ? this.props.activeAccount.get('name') : ''
    const activeGroupName = this.props.activeGroup ? this.props.activeGroup.get('name') : ''

    return (
      <AnalyticsPage
        activeName={propertyName}
        changeDateRange={this.changeDateRange}
        changeOnOffNetChartType={this.props.uiActions.changeOnOffNetChartType}
        dateRange={this.state.dateRange}
        endDate={this.state.endDate}
        exportFilenamePart={`${activeAccountName} - ${activeGroupName} - ${propertyName} - ${moment().format()}`}
        exportsActions={this.props.exportsActions}
        exportsDialogState={this.props.exportsDialogState}
        fetchingMetrics={this.props.fetchingMetrics}
        fileErrorSummary={this.props.fileErrorSummary}
        fileErrorURLs={this.props.fileErrorURLs}
        metrics={metrics}
        onOffNet={this.props.onOffNet}
        onOffNetChartType={this.props.onOffNetChartType}
        onOffNetToday={this.props.onOffNetToday}
        reportsFetching={this.props.reportsFetching}
        serviceProviders={this.props.serviceProviders}
        serviceTypes={this.props.serviceTypes}
        statusCodes={this.props.statusCodes}
        siblings={availableHosts}
        startDate={this.state.startDate}
        storageStats={this.props.storageStats}
        toggleAnalysisServiceType={this.props.uiActions.toggleAnalysisServiceType}
        toggleAnalysisStatusCode={this.props.uiActions.toggleAnalysisStatusCode}
        totalEgress={this.props.totalEgress}
        trafficByCountry={this.props.trafficByCountry}
        trafficByTime={this.props.trafficByTime}
        trafficFetching={this.props.trafficFetching}
        type="property"
        urlMetrics={this.props.urlMetrics}
        visitorsByBrowser={this.props.visitorsByBrowser}
        visitorsByCountry={this.props.visitorsByCountry}
        visitorsByOS={this.props.visitorsByOS}
        visitorsByTime={this.props.visitorsByTime}
        visitorsFetching={this.props.visitorsFetching}/>
    )
  }
}

PropertyAnalytics.displayName = 'PropertyAnalytics'
PropertyAnalytics.propTypes = {
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  exportsActions: React.PropTypes.object,
  exportsDialogState: React.PropTypes.object,
  fetchData: React.PropTypes.func,
  fetchInit: React.PropTypes.func,
  fetchingMetrics: React.PropTypes.bool,
  fileErrorSummary: React.PropTypes.instanceOf(Immutable.Map),
  fileErrorURLs: React.PropTypes.instanceOf(Immutable.List),
  hosts: React.PropTypes.instanceOf(Immutable.List),
  location: React.PropTypes.object,
  metrics: React.PropTypes.instanceOf(Immutable.List),
  onOffNet: React.PropTypes.instanceOf(Immutable.Map),
  onOffNetChartType: React.PropTypes.string,
  onOffNetToday: React.PropTypes.instanceOf(Immutable.Map),
  params: React.PropTypes.object,
  reportsFetching: React.PropTypes.bool,
  serviceProviders: React.PropTypes.instanceOf(Immutable.List),
  serviceTypes: React.PropTypes.instanceOf(Immutable.List),
  statusCodes: React.PropTypes.instanceOf(Immutable.List),
  storageStats: React.PropTypes.instanceOf(Immutable.List),
  totalEgress: React.PropTypes.number,
  trafficByCountry: React.PropTypes.instanceOf(Immutable.List),
  trafficByTime: React.PropTypes.instanceOf(Immutable.List),
  trafficFetching: React.PropTypes.bool,
  uiActions: React.PropTypes.object,
  urlMetrics: React.PropTypes.instanceOf(Immutable.List),
  visitorsByBrowser: React.PropTypes.instanceOf(Immutable.Map),
  visitorsByCountry: React.PropTypes.instanceOf(Immutable.Map),
  visitorsByOS: React.PropTypes.instanceOf(Immutable.Map),
  visitorsByTime: React.PropTypes.instanceOf(Immutable.List),
  visitorsFetching: React.PropTypes.bool
}

function mapStateToProps(state) {
  return {
    activeAccount: state.account.get('activeAccount'),
    activeGroup: state.group.get('activeGroup'),
    exportsDialogState: state.exports.toObject(),
    hosts: state.host.get('allHosts'),
    fetchingMetrics: state.metrics.get('fetchingHostMetrics'),
    fileErrorSummary: state.reports.get('fileErrorSummary'),
    fileErrorURLs: state.reports.get('fileErrorURLs'),
    metrics: state.metrics.get('hostMetrics'),
    onOffNet: state.traffic.get('onOffNet'),
    onOffNetChartType: state.ui.get('analysisOnOffNetChartType'),
    onOffNetToday: state.traffic.get('onOffNetToday'),
    reportsFetching: state.reports.get('fetching'),
    serviceProviders: state.traffic.get('serviceProviders'),
    serviceTypes: state.ui.get('analysisServiceTypes'),
    statusCodes: state.ui.get('analysisErrorStatusCodes'),
    storageStats: state.traffic.get('storage'),
    totalEgress: state.traffic.get('totalEgress'),
    trafficByCountry: state.traffic.get('byCountry'),
    trafficByTime: state.traffic.get('byTime'),
    trafficFetching: state.traffic.get('fetching'),
    urlMetrics: state.reports.get('urlMetrics'),
    visitorsByBrowser: state.visitors.get('byBrowser'),
    visitorsByCountry: state.visitors.get('byCountry'),
    visitorsByOS: state.visitors.get('byOS'),
    visitorsByTime: state.visitors.get('byTime'),
    visitorsFetching: state.visitors.get('fetching')
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const accountActions = bindActionCreators(accountActionCreators, dispatch)
  const groupActions = bindActionCreators(groupActionCreators, dispatch)
  const hostActions = bindActionCreators(hostActionCreators, dispatch)
  const metricsActions = bindActionCreators(metricsActionCreators, dispatch)
  const reportsActions = bindActionCreators(reportsActionCreators, dispatch)
  const trafficActions = bindActionCreators(trafficActionCreators, dispatch)
  const visitorsActions = bindActionCreators(visitorsActionCreators, dispatch)

  function fetchData(property, start, end, serviceTypes) {
    const {account, group} = ownProps.params
    const fetchOpts = {
      account: account,
      group: group,
      property: property,
      startDate: start.format('X'),
      endDate: end.format('X')
    }

    if(serviceTypes.size === 1) {
      fetchOpts.service_type = serviceTypes.first()
    }

    const countryOpts = Object.assign({}, fetchOpts, {
      max_countries: 10
    })

    const onOffOpts = Object.assign({}, fetchOpts)
    onOffOpts.granularity = 'day'
    const onOffTodayOpts = Object.assign({}, onOffOpts)
    onOffTodayOpts.startDate = moment().utc().startOf('day').format('X'),
    onOffTodayOpts.endDate = moment().utc().format('X')
    trafficActions.startFetching()
    visitorsActions.startFetching()
    reportsActions.startFetching()
    metricsActions.startHostFetching()
    Promise.all([
      metricsActions.fetchHostMetrics({
        account: account,
        group: group,
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
      trafficActions.fetchServiceProviders(onOffOpts),
      trafficActions.fetchStorage()
    ]).then(trafficActions.finishFetching)
    Promise.all([
      visitorsActions.fetchByTime(fetchOpts),
      visitorsActions.fetchByCountry(countryOpts),
      visitorsActions.fetchByBrowser(fetchOpts),
      visitorsActions.fetchByOS(fetchOpts)
    ]).then(visitorsActions.finishFetching)
    Promise.all([
      reportsActions.fetchFileErrorsMetrics(fetchOpts),
      reportsActions.fetchURLMetrics(fetchOpts)
    ]).then(reportsActions.finishFetching)
  }

  function fetchInit() {
    const {brand, account, group} = ownProps.params
    hostActions.fetchHosts(brand, account, group)
    accountActions.fetchAccount(brand, account)
    groupActions.fetchGroup(brand, account, group)
  }

  return {
    exportsActions: bindActionCreators(exportsActionCreators, dispatch),
    fetchData: fetchData,
    fetchInit: fetchInit,
    uiActions: bindActionCreators(uiActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyAnalytics);
