import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Nav, NavItem } from 'react-bootstrap'

import * as trafficActionCreators from '../redux/modules/traffic'

import PageContainer from '../components/layout/page-container'
import Sidebar from '../components/layout/sidebar'
import Content from '../components/layout/content'
import Analyses from '../components/analysis/analyses'
import AnalysisTraffic from '../components/analysis/traffic'

export class Analysis extends React.Component {
  constructor(props) {
    super(props);

    this.changeTab = this.changeTab.bind(this)
  }
  componentWillMount() {
    this.props.trafficActions.startFetching()
    Promise.all([
      this.props.trafficActions.fetchByTime(),
      this.props.trafficActions.fetchByCountry()
    ]).then(this.props.trafficActions.finishFetching)
  }
  changeTab() {
    console.log('change tab')
  }
  render() {
    return (
      <PageContainer hasSidebar={true} className="configuration-container">
        <Sidebar>
          <Analyses/>
        </Sidebar>

        <Content>
          <Nav bsStyle="tabs" activeKey={1} onSelect={this.changeTab}>
            <NavItem eventKey={1}>Traffic</NavItem>
            <NavItem eventKey={2}>Visitors</NavItem>
          </Nav>

          <div className="container-fluid analysis-container">
            <AnalysisTraffic fetching={this.props.fetching}
              byTime={this.props.trafficByTime}
              byCountry={this.props.trafficByCountry}/>
          </div>
        </Content>
      </PageContainer>
    );
  }
}

Analysis.displayName = 'Analysis'
Analysis.propTypes = {
  fetching: React.PropTypes.bool,
  trafficActions: React.PropTypes.object,
  trafficByCountry: React.PropTypes.instanceOf(Immutable.List),
  trafficByTime: React.PropTypes.instanceOf(Immutable.List)
}

function mapStateToProps(state) {
  return {
    trafficByCountry: state.traffic.get('byCountry'),
    trafficByTime: state.traffic.get('byTime'),
    fetching: state.traffic.get('fetching')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    trafficActions: bindActionCreators(trafficActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Analysis);
