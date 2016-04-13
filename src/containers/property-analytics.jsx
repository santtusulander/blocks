import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Nav, NavItem } from 'react-bootstrap'
import moment from 'moment'

import * as hostActionCreators from '../redux/modules/host'
import * as trafficActionCreators from '../redux/modules/traffic'
import * as uiActionCreators from '../redux/modules/ui'
import * as visitorsActionCreators from '../redux/modules/visitors'

import PageContainer from '../components/layout/page-container'
import Sidebar from '../components/layout/sidebar'
import Content from '../components/layout/content'
import Analyses from '../components/analysis/analyses'
import AnalysisTraffic from '../components/analysis/traffic'
import AnalysisVisitors from '../components/analysis/visitors'
import AnalysisSPReport from '../components/analysis/sp-report'
import AnalysisFileError from '../components/analysis/file-error'
import AnalysisPlaybackDemo from '../components/analysis/playback-demo'

export class PropertyAnalytics extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'traffic',
      endDate: moment().utc(),
      startDate: moment().utc().startOf('month')
    }

    this.changeTab = this.changeTab.bind(this)
    this.changeDateRange = this.changeDateRange.bind(this)
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
    Promise.all([
      this.props.trafficActions.fetchByTime(fetchOpts),
      this.props.trafficActions.fetchByCountry(fetchOpts),
      this.props.trafficActions.fetchTotalEgress(fetchOpts),
      this.props.trafficActions.fetchOnOffNet(onOffOpts),
      this.props.trafficActions.fetchOnOffNetToday(onOffTodayOpts)
    ]).then(this.props.trafficActions.finishFetching)
    Promise.all([
      this.props.visitorsActions.fetchByTime(fetchOpts),
      this.props.visitorsActions.fetchByCountry(fetchOpts),
      this.props.visitorsActions.fetchByBrowser(fetchOpts),
      this.props.visitorsActions.fetchByOS(fetchOpts)
    ]).then(this.props.visitorsActions.finishFetching)
  }
  changeTab(newTab) {
    this.setState({activeTab: newTab})
  }
  changeDateRange(startDate, endDate) {
    this.setState({endDate: endDate, startDate: startDate}, this.fetchData)
  }
  render() {
    const availableHosts = this.props.hosts.map(host => {
      return {
        active: host === this.props.location.query.name,
        link: `/content/analytics/property/${this.props.params.brand}/${this.props.params.account}/${this.props.params.group}/property?name=${encodeURIComponent(host).replace(/\./g, "%2e")}`,
        name: host
      }
    })
    return (
      <PageContainer hasSidebar={true} className="configuration-container">
        <Sidebar>
          <Analyses
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
            navOptions={availableHosts}/>
        </Sidebar>

        <Content>
          <Nav bsStyle="tabs" activeKey={this.state.activeTab} onSelect={this.changeTab}>
            <NavItem eventKey="traffic">Traffic</NavItem>
            <NavItem eventKey="visitors">Visitors</NavItem>
            <NavItem eventKey="sp-report">SP On/Off Net</NavItem>
            <NavItem eventKey="file-error">File Error</NavItem>
            <NavItem eventKey="playback-demo">Playback Demo</NavItem>
          </Nav>

          <div className="container-fluid analysis-container">
            {this.state.activeTab === 'traffic' ?
              <AnalysisTraffic fetching={this.props.trafficFetching}
                byTime={this.props.trafficByTime}
                byCountry={this.props.trafficByCountry}
                serviceTypes={this.props.serviceTypes}
                totalEgress={this.props.totalEgress}/>
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
              <AnalysisFileError fetching={false}/>
              : ''}
            {this.state.activeTab === 'playback-demo' ?
              <AnalysisPlaybackDemo/>
              : ''}
          </div>
        </Content>
      </PageContainer>
    );
  }
}

PropertyAnalytics.displayName = 'PropertyAnalytics'
PropertyAnalytics.propTypes = {
  hostActions: React.PropTypes.object,
  hosts: React.PropTypes.instanceOf(Immutable.List),
  location: React.PropTypes.object,
  onOffNet: React.PropTypes.instanceOf(Immutable.Map),
  onOffNetToday: React.PropTypes.instanceOf(Immutable.Map),
  params: React.PropTypes.object,
  serviceTypes: React.PropTypes.instanceOf(Immutable.List),
  spChartType: React.PropTypes.string,
  totalEgress: React.PropTypes.number,
  trafficActions: React.PropTypes.object,
  trafficByCountry: React.PropTypes.instanceOf(Immutable.List),
  trafficByTime: React.PropTypes.instanceOf(Immutable.List),
  trafficFetching: React.PropTypes.bool,
  uiActions: React.PropTypes.object,
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
    onOffNet: state.traffic.get('onOffNet'),
    onOffNetToday: state.traffic.get('onOffNetToday'),
    serviceTypes: state.ui.get('analysisServiceTypes'),
    spChartType: state.ui.get('analysisSPChartType'),
    totalEgress: state.traffic.get('totalEgress'),
    trafficByCountry: state.traffic.get('byCountry'),
    trafficByTime: state.traffic.get('byTime'),
    trafficFetching: state.traffic.get('fetching'),
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
    trafficActions: bindActionCreators(trafficActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    visitorsActions: bindActionCreators(visitorsActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyAnalytics);
