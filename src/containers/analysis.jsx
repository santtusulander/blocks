import React from 'react'
import Immutable from 'immutable'
import numeral from 'numeral'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Nav, NavItem } from 'react-bootstrap'

import * as trafficActionCreators from '../redux/modules/traffic'

import PageContainer from '../components/layout/page-container'
import Sidebar from '../components/layout/sidebar'
import Content from '../components/layout/content'
import Analyses from '../components/analysis/analyses'
import AnalysisByTime from '../components/analysis/by-time'
import AnalysisByLocation from '../components/analysis/by-location'

export class Analysis extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      byLocationWidth: 0,
      byTimeWidth: 0
    }

    this.measureContainers = this.measureContainers.bind(this)
    this.changeTab = this.changeTab.bind(this)
  }
  componentWillMount() {
    this.props.trafficActions.startFetching()
    Promise.all([
      this.props.trafficActions.fetchByTime(),
      this.props.trafficActions.fetchByCountry()
    ]).then(this.props.trafficActions.finishFetching)
  }
  componentDidMount() {
    this.measureContainers()
    window.addEventListener('resize', this.measureContainers)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.measureContainers)
  }
  measureContainers() {
    this.setState({
      byLocationWidth: this.refs.byLocationHolder.clientWidth,
      byTimeWidth: this.refs.byTimeHolder.clientWidth
    })
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
            <h3>TRANSFER BY TIME</h3>
            <div ref="byTimeHolder">
              {this.props.fetching ?
                <div>Loading...</div> :
                <AnalysisByTime axes={true} padding={40}
                  data={this.props.byTime.toJS()}
                  width={this.state.byTimeWidth} height={this.state.byTimeWidth / 2}/>
                }
            </div>
            <h3>BY GEOGRAPHY</h3>
            <div ref="byLocationHolder">
              <AnalysisByLocation
                width={this.state.byLocationWidth}
                height={this.state.byLocationWidth / 2}
                countryData={this.props.byCountry}/>
            </div>
            <h3>BY COUNTRY</h3>
            <table className="table by-country-table">
              <thead>
                <tr>
                  <th>Country</th>
                  <th>Traffic GB</th>
                  <th>% of Traffic</th>
                  <th>Period Trend</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                {this.props.byCountry.map((country, i) => {
                  const totalBytes = country.get('traffic').reduce((total, traffic) => {
                    return total + traffic.get('bytes')
                  }, 0)
                  const startBytes = country.get('traffic').first().get('bytes')
                  const endBytes = country.get('traffic').last().get('bytes')
                  let trending = startBytes / endBytes
                  if(trending > 1) {
                    trending = numeral((trending - 1) * -1).format('0%')
                  }
                  else {
                    trending = numeral(trending).format('+0%');
                  }
                  return (
                    <tr key={i}>
                      <td>{country.get('country')}</td>
                      <td>{numeral(totalBytes).format('0,0')}</td>
                      <td>{country.get('percent_total')}%</td>
                      <td>Chart</td>
                      <td>{trending}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Content>
      </PageContainer>
    );
  }
}

Analysis.displayName = 'Analysis'
Analysis.propTypes = {
  byCountry: React.PropTypes.instanceOf(Immutable.List),
  byTime: React.PropTypes.instanceOf(Immutable.List),
  fetching: React.PropTypes.bool,
  trafficActions: React.PropTypes.object
}

function mapStateToProps(state) {
  return {
    byCountry: state.traffic.get('byCountry'),
    byTime: state.traffic.get('byTime'),
    fetching: state.traffic.get('fetching')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    trafficActions: bindActionCreators(trafficActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Analysis);
