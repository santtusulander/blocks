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

import AnalyticsPage from '../components/analysis/analytics-page'

export class PropertyAnalytics extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'traffic',
      activeVideo: '/elephant/169ar/elephant_master.m3u8',
      dateRange: 'month to date',
      endDate: moment().utc().endOf('day'),
      startDate: moment().utc().startOf('month')
    }

    this.changeDateRange = this.changeDateRange.bind(this)
  }

  componentWillMount() {
    this.props.hostActions.fetchHosts(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group
    )
    this.props.accountActions.fetchAccount(
      this.props.params.brand,
      this.props.params.account
    )
    this.props.groupActions.fetchGroup(
      this.props.params.brand,
      this.props.params.account,
      this.props.params.group
    )
    this.fetchData()
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.location.query.name !== this.props.location.query.name) {
      this.fetchData(nextProps.location.query.name)
    }
  }
  fetchData(property) {
    if(!property) {
      property = this.props.location.query.name
    }
    const fetchOpts = {
      account: this.props.params.account,
      group: this.props.params.group,
      property: property,
      startDate: this.state.startDate.format('X'),
      endDate: this.state.endDate.format('X')
    }
    const onOffOpts = Object.assign({}, fetchOpts)
    onOffOpts.granularity = 'day'
    const onOffTodayOpts = Object.assign({}, onOffOpts)
    onOffTodayOpts.startDate = moment().utc().startOf('day').format('X'),
    onOffTodayOpts.endDate = moment().utc().format('X')
    this.props.trafficActions.startFetching()
    this.props.visitorsActions.startFetching()
    this.props.reportsActions.startFetching()
    this.props.metricsActions.startHostFetching()
    Promise.all([
      this.props.metricsActions.fetchHostMetrics({
        account: this.props.params.account,
        group: this.props.params.group,
        startDate: this.state.startDate.format('X'),
        endDate: this.state.endDate.format('X')
      })
    ]).then(this.props.metricsActions.finishFetching)
    Promise.all([
      this.props.trafficActions.fetchByTime(fetchOpts),
      this.props.trafficActions.fetchByCountry(fetchOpts),
      this.props.trafficActions.fetchTotalEgress(fetchOpts),
      this.props.trafficActions.fetchOnOffNet(onOffOpts),
      this.props.trafficActions.fetchOnOffNetToday(onOffTodayOpts),
      this.props.trafficActions.fetchStorage()
    ]).then(this.props.trafficActions.finishFetching)
    Promise.all([
      this.props.visitorsActions.fetchByTime(fetchOpts),
      this.props.visitorsActions.fetchByCountry(fetchOpts),
      this.props.visitorsActions.fetchByBrowser(fetchOpts),
      this.props.visitorsActions.fetchByOS(fetchOpts)
    ]).then(this.props.visitorsActions.finishFetching)
    Promise.all([
      this.props.reportsActions.fetchFileErrorsMetrics(fetchOpts),
      this.props.reportsActions.fetchURLMetrics()
    ]).then(this.props.reportsActions.finishFetching)
  }
  changeTab(newTab) {
    this.setState({activeTab: newTab})
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
        changeSPChartType={this.props.uiActions.changeSPChartType}
        dateRange={this.state.dateRange}
        endDate={this.state.endDate}
        exportFilenamePart={`${activeAccountName} - ${activeGroupName} - ${propertyName} - ${moment().format()}`}
        fetchingMetrics={this.props.fetchingMetrics}
        fileErrorSummary={this.props.fileErrorSummary}
        fileErrorURLs={this.props.fileErrorURLs}
        metrics={metrics}
        onOffNet={this.props.onOffNet}
        onOffNetToday={this.props.onOffNetToday}
        reportsFetching={this.props.reportsFetching}
        serviceTypes={this.props.serviceTypes}
        siblings={availableHosts}
        spChartType={this.props.spChartType}
        startDate={this.state.startDate}
        storageStats={this.props.storageStats}
        toggleAnalysisServiceType={this.props.uiActions.toggleAnalysisServiceType}
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
  accountActions: React.PropTypes.object,
  activeAccount: React.PropTypes.instanceOf(Immutable.Map),
  activeGroup: React.PropTypes.instanceOf(Immutable.Map),
  fetchingMetrics: React.PropTypes.bool,
  fileErrorSummary: React.PropTypes.instanceOf(Immutable.Map),
  fileErrorURLs: React.PropTypes.instanceOf(Immutable.List),
  groupActions: React.PropTypes.object,
  hostActions: React.PropTypes.object,
  hosts: React.PropTypes.instanceOf(Immutable.List),
  location: React.PropTypes.object,
  metrics: React.PropTypes.instanceOf(Immutable.List),
  metricsActions: React.PropTypes.object,
  onOffNet: React.PropTypes.instanceOf(Immutable.Map),
  onOffNetToday: React.PropTypes.instanceOf(Immutable.Map),
  params: React.PropTypes.object,
  reportsActions: React.PropTypes.object,
  reportsFetching: React.PropTypes.bool,
  serviceTypes: React.PropTypes.instanceOf(Immutable.List),
  spChartType: React.PropTypes.string,
  storageStats: React.PropTypes.instanceOf(Immutable.List),
  totalEgress: React.PropTypes.number,
  trafficActions: React.PropTypes.object,
  trafficByCountry: React.PropTypes.instanceOf(Immutable.List),
  trafficByTime: React.PropTypes.instanceOf(Immutable.List),
  trafficFetching: React.PropTypes.bool,
  uiActions: React.PropTypes.object,
  urlMetrics: React.PropTypes.instanceOf(Immutable.List),
  visitorsActions: React.PropTypes.object,
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
    hosts: state.host.get('allHosts'),
    fetchingMetrics: state.metrics.get('fetchingHostMetrics'),
    fileErrorSummary: state.reports.get('fileErrorSummary'),
    fileErrorURLs: state.reports.get('fileErrorURLs'),
    metrics: state.metrics.get('hostMetrics'),
    onOffNet: state.traffic.get('onOffNet'),
    onOffNetToday: state.traffic.get('onOffNetToday'),
    reportsFetching: state.reports.get('fetching'),
    serviceTypes: state.ui.get('analysisServiceTypes'),
    spChartType: state.ui.get('analysisSPChartType'),
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

function mapDispatchToProps(dispatch) {
  return {
    accountActions: bindActionCreators(accountActionCreators, dispatch),
    groupActions: bindActionCreators(groupActionCreators, dispatch),
    hostActions: bindActionCreators(hostActionCreators, dispatch),
    metricsActions: bindActionCreators(metricsActionCreators, dispatch),
    reportsActions: bindActionCreators(reportsActionCreators, dispatch),
    trafficActions: bindActionCreators(trafficActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    visitorsActions: bindActionCreators(visitorsActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyAnalytics);
