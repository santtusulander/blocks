import React from 'react'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Row, Col, Nav, NavItem } from 'react-bootstrap'

import * as trafficActionCreators from '../redux/modules/traffic'

import AnalysisByTime from '../components/analysis/by-time'
import AnalysisByLocation from '../components/analysis/by-location'

const fakeRecentData = [
  {epoch_start: 1451606400, bytes: 39405, requests: 943},
  {epoch_start: 1451606500, bytes: 54766, requests: 546},
  {epoch_start: 1451606600, bytes: 54675, requests: 435},
  {epoch_start: 1451606700, bytes: 34336, requests: 345},
  {epoch_start: 1451606800, bytes: 23456, requests: 567},
  {epoch_start: 1451606900, bytes: 56756, requests: 244},
  {epoch_start: 1451607000, bytes: 65466, requests: 455},
  {epoch_start: 1451607100, bytes: 23456, requests: 233},
  {epoch_start: 1451607200, bytes: 67454, requests: 544},
  {epoch_start: 1451607300, bytes: 54766, requests: 546},
  {epoch_start: 1451607400, bytes: 54675, requests: 435},
  {epoch_start: 1451607500, bytes: 34336, requests: 456},
  {epoch_start: 1451607600, bytes: 23456, requests: 567},
  {epoch_start: 1451607700, bytes: 56756, requests: 244},
  {epoch_start: 1451607800, bytes: 65466, requests: 455},
  {epoch_start: 1451607900, bytes: 23456, requests: 456},
  {epoch_start: 1451608000, bytes: 67454, requests: 544},
  {epoch_start: 1451608100, bytes: 23456, requests: 233},
  {epoch_start: 1451608200, bytes: 67454, requests: 544},
  {epoch_start: 1451608300, bytes: 54766, requests: 546},
  {epoch_start: 1451608400, bytes: 54675, requests: 435},
  {epoch_start: 1451608500, bytes: 34336, requests: 456},
  {epoch_start: 1451608600, bytes: 23456, requests: 567},
  {epoch_start: 1451608700, bytes: 56756, requests: 244},
  {epoch_start: 1451608800, bytes: 65466, requests: 455},
  {epoch_start: 1451608900, bytes: 23456, requests: 456},
  {epoch_start: 1451609000, bytes: 67454, requests: 544}
]

const fakeCountryData = Immutable.fromJS([
  {id: 'usa', trending: -1},
  {id: 'can', trending: 1},
  {id: 'mex', trending: 0},
  {id: 'aus', trending: 0},
  {id: 'bra', trending: -1},
  {id: 'rus', trending: 1}
])

const fakeStateData = Immutable.fromJS([
  {id: 'Alabama', trending: -1},
  {id: 'Alaska', trending: 1},
  {id: 'Arkansas', trending: 0},
  {id: 'Arizona', trending: -1},
  {id: 'California', trending: -1},
  {id: 'Connecticut', trending: 0},
  {id: 'Delaware', trending: -1},
  {id: 'Florida', trending: 1},
  {id: 'Georgia', trending: 1},
  {id: 'Oregon', trending: -1},
  {id: 'Michigan', trending: -1},
  {id: 'Nevada', trending: 0},
  {id: 'Utah', trending: 1}
])

const fakeCityData = Immutable.fromJS([
  {name: 'Atlanta', state: 'Georgia', trending: 1},
  {name: 'Savannah', state: 'Georgia', trending: 0},
  {name: 'San Francisco', state: 'California', trending: 1},
  {name: 'Sacramento', state: 'California', trending: -1},
  {name: 'San Bernardino', state: 'California', trending: 0},
  {name: 'Los Angeles', state: 'California', trending: 1},
  {name: 'San Diego', state: 'California', trending: 0}
])

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
      <div className="analysis-container container">
        <Nav bsStyle="tabs" activeKey={1} onSelect={this.changeTab}>
          <NavItem eventKey={1}>Traffic</NavItem>
          <NavItem eventKey={2}>Visitors</NavItem>
        </Nav>
        <Row>
          <Col sm={3} xs={6}>
            <h3>Out</h3>
            <div className="summary-data">
              <h4>Transferred out to Internet</h4>
              <div className="stat">
                2,211
              </div>
            </div>
          </Col>
          <Col sm={3} xs={6}>
            <h3>In</h3>
            <div className="summary-data">
              <h4>Transferred out to Internet</h4>
              <div className="stat">
                2,211
              </div>
            </div>
          </Col>
        </Row>
        <h3>TRANSFER BY TIME</h3>
        <div ref="byTimeHolder">
          <AnalysisByTime axes={true} padding={40}
            data={fakeRecentData}
            width={this.state.byTimeWidth} height={this.state.byTimeWidth / 2}/>
        </div>
        <h3>BY GEOGRAPHY</h3>
        <div ref="byLocationHolder">
          <AnalysisByLocation
            width={this.state.byLocationWidth}
            height={this.state.byLocationWidth / 2}
            countryData={fakeCountryData}
            stateData={fakeStateData}
            cityData={fakeCityData}/>
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
            <tr>
              <td>United States</td>
              <td>1,235,789</td>
              <td>44%</td>
              <td>Chart</td>
              <td>+64%</td>
            </tr>
            <tr>
              <td>Germany</td>
              <td>424,242</td>
              <td>22%</td>
              <td>Chart</td>
              <td>+1%</td>
            </tr>
            <tr>
              <td>United Kingdom</td>
              <td>321,214</td>
              <td>7%</td>
              <td>Chart</td>
              <td>+65%</td>
            </tr>
            <tr>
              <td>France</td>
              <td>10,000</td>
              <td>7%</td>
              <td>Chart</td>
              <td>-7%</td>
            </tr>
            <tr>
              <td>Australia</td>
              <td>424</td>
              <td>7%</td>
              <td>Chart</td>
              <td>+7%</td>
            </tr>
            <tr>
              <td>Finland</td>
              <td>100</td>
              <td>7%</td>
              <td>Chart</td>
              <td>+3%</td>
            </tr>
            <tr>
              <td>Rest</td>
              <td>1,221,122</td>
              <td>20%</td>
              <td>Chart</td>
              <td>+10%</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

Analysis.displayName = 'Analysis'
Analysis.propTypes = {}

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
