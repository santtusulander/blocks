import React from 'react'
import ReactDOM from 'react-dom'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Modal, Nav, NavItem } from 'react-bootstrap'
import moment from 'moment'

import * as hostActionCreators from '../redux/modules/host'
import * as metricsActionCreators from '../redux/modules/metrics'
import * as trafficActionCreators from '../redux/modules/traffic'
import * as uiActionCreators from '../redux/modules/ui'
import * as visitorsActionCreators from '../redux/modules/visitors'
import * as reportsActionCreators from '../redux/modules/reports'

import PageContainer from '../components/layout/page-container'
import Sidebar from '../components/layout/sidebar'
import Content from '../components/layout/content'
import Analyses from '../components/analysis/analyses'
import AnalysisTraffic from '../components/analysis/traffic'
import AnalysisVisitors from '../components/analysis/visitors'
import AnalysisSPReport from '../components/analysis/sp-report'
import AnalysisFileError from '../components/analysis/file-error'
import AnalysisURLReport from '../components/analysis/url-report'
import AnalysisStorageUsage from '../components/analysis/storage-usage'
import AnalysisPlaybackDemo from '../components/analysis/playback-demo'

export class PropertyAnalytics extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'traffic',
      activeTabDescription: 'Traffic',
      activeVideo: '/elephant/169ar/elephant_master.m3u8',
      dateRange: 'month to date',
      endDate: moment().utc().endOf('day'),
      startDate: moment().utc().startOf('month'),
      showExportPanel: false
    }

    this.changeTab = this.changeTab.bind(this)
    this.getTabDescription = this.getTabDescription.bind(this)
    this.changeExport = this.changeExport.bind(this)
    this.changeDateRange = this.changeDateRange.bind(this)
    this.changeActiveVideo = this.changeActiveVideo.bind(this)

  }
  componentWillMount() {
    this.props.hostActions.fetchHosts(
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
  getTabDescription(tab) {
    let description = ReactDOM.findDOMNode(this.refs[tab]).childNodes[0].innerHTML
    return description
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
    this.setState({
      activeTab: newTab,
      activeTabDescription: this.getTabDescription(newTab)
    })
  }
  changeExport() {
    this.setState({
      showExportPanel: !this.state.showExportPanel
    })
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
  changeActiveVideo(video) {
    this.setState({activeVideo: video})
  }
  render() {
    const availableHosts = this.props.hosts.map(host => {
      return {
        active: host === this.props.location.query.name,
        link: `/content/analytics/property/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${encodeURIComponent(host).replace(/\./g, "%2e")}`,
        name: host
      }
    })
    // TODO: This should have its own endpoint so we don't have to fetch info
    // for all accounts
    const metrics = this.props.metrics.find(metric => metric.get('property') + "" === this.props.location.query.name) || Immutable.Map()
    const peakTraffic = metrics.has('transfer_rates') ?
      metrics.get('transfer_rates').get('peak') : '0.0 Gbps'
    const avgTraffic = metrics.has('transfer_rates') ?
      metrics.get('transfer_rates').get('average') : '0.0 Gbps'
    const lowTraffic = metrics.has('transfer_rates') ?
      metrics.get('transfer_rates').get('lowest') : '0.0 Gbps'

    return (
      <PageContainer hasSidebar={true} className="configuration-container">
        <Sidebar>
          <Analyses
            changeExport={this.changeExport}
            endDate={this.state.endDate}
            startDate={this.state.startDate}
            changeDateRange={this.changeDateRange}
            changeSPChartType={this.props.uiActions.changeSPChartType}
            serviceTypes={this.props.serviceTypes}
            spChartType={this.props.spChartType}
            toggleServiceType={this.props.uiActions.toggleAnalysisServiceType}
            activeTab={this.state.activeTab}
            type="property"
            name={this.props.location.query.name}
            navOptions={availableHosts}
            activeVideo={this.state.activeVideo}
            changeVideo={this.changeActiveVideo}/>
        </Sidebar>

        <Content>
          <Nav bsStyle="tabs" activeKey={this.state.activeTab} onSelect={this.changeTab}>
            <NavItem eventKey="traffic" ref="traffic">Traffic</NavItem>
            <NavItem eventKey="visitors" ref="visitors">Visitors</NavItem>
            <NavItem eventKey="sp-report" ref="sp-report">SP On/Off Net</NavItem>
            <NavItem eventKey="file-error" ref="file-error">File Error</NavItem>
            <NavItem eventKey="url-report" ref="url-report">URL Report</NavItem>
            <NavItem eventKey="storage-usage" ref="storage-usage">Storage Usage</NavItem>
            <NavItem eventKey="playback-demo" ref="playback-demo">Playback Demo</NavItem>
          </Nav>

          <div className="container-fluid analysis-container">
            {this.state.activeTab === 'traffic' ?
              <AnalysisTraffic fetching={this.props.trafficFetching}
                byTime={this.props.trafficByTime}
                byCountry={this.props.trafficByCountry}
                serviceTypes={this.props.serviceTypes}
                totalEgress={this.props.totalEgress}
                peakTraffic={!this.props.fetchingMetrics ? peakTraffic : null}
                avgTraffic={!this.props.fetchingMetrics ? avgTraffic : null}
                lowTraffic={!this.props.fetchingMetrics ? lowTraffic : null}
                dateRange={this.state.dateRange}/>
              : ''}
            {this.state.activeTab === 'visitors' ?
              <AnalysisVisitors fetching={this.props.visitorsFetching}
                byTime={this.props.visitorsByTime}
                byCountry={this.props.visitorsByCountry.get('countries')}
                byBrowser={this.props.visitorsByBrowser.get('browsers')}
                byOS={this.props.visitorsByOS.get('os')}/>
              : ''}
            {this.state.activeTab === 'sp-report' ?
              <AnalysisSPReport fetching={false}
                serviceProviderStats={this.props.onOffNet}
                serviceProviderStatsToday={this.props.onOffNetToday}
                spChartType={this.props.spChartType}/>
              : ''}
            {this.state.activeTab === 'file-error' ?
              <AnalysisFileError fetching={this.props.reportsFetching}
                summary={this.props.fileErrorSummary}
                urls={this.props.fileErrorURLs}/>
              : ''}
            {this.state.activeTab === 'url-report' ?
              <AnalysisURLReport fetching={this.props.reportsFetching}
                urls={this.props.urlMetrics}/>
              : ''}
            {this.state.activeTab === 'storage-usage' ?
              <AnalysisStorageUsage fetching={this.props.trafficFetching}
                storageStats={this.props.storageStats}/>
              : ''}
            {this.state.activeTab === 'playback-demo' ?
              <AnalysisPlaybackDemo
                activeVideo={this.state.activeVideo}/>
              : ''}

            {this.state.showExportPanel ?
              <Modal show={true}
                     onHide={this.changeExport}
                     dialogClassName="configuration-sidebar">
                <Modal.Header>
                  <h1>Export</h1>
                  <p>
                    {this.state.activeTabDescription} report
                  </p>
                </Modal.Header>
                <Modal.Body>
                  <p>Export panel body</p>
                </Modal.Body>
              </Modal> : null
            }
          </div>
        </Content>
      </PageContainer>
    );
  }
}

PropertyAnalytics.displayName = 'PropertyAnalytics'
PropertyAnalytics.propTypes = {
  fetchingMetrics: React.PropTypes.bool,
  fileErrorSummary: React.PropTypes.instanceOf(Immutable.Map),
  fileErrorURLs: React.PropTypes.instanceOf(Immutable.List),
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
    hostActions: bindActionCreators(hostActionCreators, dispatch),
    metricsActions: bindActionCreators(metricsActionCreators, dispatch),
    reportsActions: bindActionCreators(reportsActionCreators, dispatch),
    trafficActions: bindActionCreators(trafficActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    visitorsActions: bindActionCreators(visitorsActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyAnalytics);
