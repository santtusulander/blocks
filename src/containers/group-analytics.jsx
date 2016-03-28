import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Nav, NavItem } from 'react-bootstrap'
import moment from 'moment'

import * as trafficActionCreators from '../redux/modules/traffic'
import * as uiActionCreators from '../redux/modules/ui'
import * as visitorsActionCreators from '../redux/modules/visitors'

import PageContainer from '../components/layout/page-container'
import Sidebar from '../components/layout/sidebar'
import Content from '../components/layout/content'
import Analyses from '../components/analysis/analyses'
import AnalysisTraffic from '../components/analysis/traffic'
import AnalysisVisitors from '../components/analysis/visitors'
// import AnalysisSPReport from '../components/analysis/sp-report'

export class GroupAnalytics extends React.Component {
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
    this.fetchData()
  }
  fetchData() {
    const fetchOpts = {
      account: this.props.params.account,
      group: this.props.params.group,
      startDate: this.state.startDate.format('X'),
      endDate: this.state.endDate.format('X')
    }
    this.props.trafficActions.startFetching()
    this.props.visitorsActions.startFetching()
    Promise.all([
      this.props.trafficActions.fetchByTime(fetchOpts),
      this.props.trafficActions.fetchByCountry(fetchOpts),
      this.props.trafficActions.fetchTotalEgress(fetchOpts)
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
    return (
      <PageContainer hasSidebar={true} className="configuration-container">
        <Sidebar>
          <Analyses
            endDate={this.state.endDate}
            startDate={this.state.startDate}
            changeDateRange={this.changeDateRange}
            serviceTypes={this.props.serviceTypes}
            toggleServiceType={this.props.uiActions.toggleAnalysisServiceType}
            isSPReport={this.state.activeTab === 'sp-report'}/>
        </Sidebar>

        <Content>
          <Nav bsStyle="tabs" activeKey={this.state.activeTab} onSelect={this.changeTab}>
            <NavItem eventKey="traffic">Traffic</NavItem>
            <NavItem eventKey="visitors">Visitors</NavItem>
            {/*<NavItem eventKey="sp-report">SP Report</NavItem>*/}
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
                byCountry={this.props.visitorsByCountry}
                byBrowser={this.props.visitorsByBrowser}
                byOS={this.props.visitorsByOS}/>
              : ''}
            {/*this.state.activeTab === 'sp-report' ?
              <AnalysisSPReport fetching={this.props.trafficFetching}
                byTime={this.props.trafficByTime}
                byCountry={this.props.trafficByCountry}
                serviceTypes={this.props.serviceTypes}
                totalEgress={this.props.totalEgress}/>
              : ''*/}
          </div>
        </Content>
      </PageContainer>
    );
  }
}

GroupAnalytics.displayName = 'GroupAnalytics'
GroupAnalytics.propTypes = {
  params: React.PropTypes.object,
  serviceTypes: React.PropTypes.instanceOf(Immutable.List),
  totalEgress: React.PropTypes.number,
  trafficActions: React.PropTypes.object,
  trafficByCountry: React.PropTypes.instanceOf(Immutable.List),
  trafficByTime: React.PropTypes.instanceOf(Immutable.List),
  trafficFetching: React.PropTypes.bool,
  uiActions: React.PropTypes.object,
  visitorsActions: React.PropTypes.object,
  visitorsByBrowser: React.PropTypes.instanceOf(Immutable.List),
  visitorsByCountry: React.PropTypes.instanceOf(Immutable.List),
  visitorsByOS: React.PropTypes.instanceOf(Immutable.List),
  visitorsByTime: React.PropTypes.instanceOf(Immutable.List),
  visitorsFetching: React.PropTypes.bool
}

function mapStateToProps(state) {
  return {
    serviceTypes: state.ui.get('analysisServiceTypes'),
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
    trafficActions: bindActionCreators(trafficActionCreators, dispatch),
    uiActions: bindActionCreators(uiActionCreators, dispatch),
    visitorsActions: bindActionCreators(visitorsActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupAnalytics);
