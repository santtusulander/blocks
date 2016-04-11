import React from 'react'
import { Col, Row } from 'react-bootstrap'
import numeral from 'numeral'
import moment from 'moment'
import Immutable from 'immutable'

import AnalysisStacked from './stacked'
import {formatBytes} from '../../util/helpers'

class AnalysisSPReport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stacksWidth: 100
    }

    this.measureContainers = this.measureContainers.bind(this)
  }
  componentDidMount() {
    this.measureContainers()
    setTimeout(() => {this.measureContainers()}, 500)
    window.addEventListener('resize', this.measureContainers)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.measureContainers)
  }
  measureContainers() {
    this.setState({
      stacksWidth: this.refs.stacksHolder.clientWidth
    })
  }
  render() {
    const stats = this.props.serviceProviderStats
    return (
      <div className="analysis-traffic">
        <Row>
          <Col xs={12}>
            <div className="analysis-data-box">
              <h4>Traffic today</h4>
              <p>0 GB</p>
              <Row className="extra-margin-top">
                <Col xs={6}>
                  <h4>On-net</h4>
                  <p className="on-net">00%</p>
                </Col>
                <Col xs={6}>
                  <h4>Off-net</h4>
                  <p className="off-net">00%</p>
                </Col>
              </Row>
            </div>
            <div className="analysis-data-box">
              <h4>Traffic Month to Date</h4>
              <p>{formatBytes(stats.get('total'))}</p>
              <Row className="extra-margin-top">
                <Col xs={6}>
                  <h4>On-net</h4>
                  <p className="on-net">
                    {numeral(stats.get('net_on').get('percent_total')).format('0,0%')}
                  </p>
                </Col>
                <Col xs={6}>
                  <h4>Off-net</h4>
                  <p className="off-net">
                    {numeral(stats.get('net_off').get('percent_total')).format('0,0%')}
                  </p>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <h3>SERVICE PROVIDER ON/OFF NET</h3>
        <div ref="stacksHolder">
          {this.props.fetching ?
            <div>Loading...</div> :
            <AnalysisStacked padding={40}
              data={stats.get('detail').toJS()}
              width={this.state.stacksWidth} height={this.state.stacksWidth / 3}/>
            }
        </div>
        <table className="table table-striped table-analysis extra-margin-top">
          <thead>
            <tr>
              <th>Date</th>
              <th>On-Net in bytes</th>
              <th>On-Net in %</th>
              <th>Off-Net in bytes</th>
              <th>Off-Net in %</th>
              <th>Total in bytes</th>
            </tr>
          </thead>
          <tbody>
            {stats.get('detail').map((day, i) => {
              return (
                <tr key={i}>
                  <td>{moment(day.get('timestamp')).format('MM/DD/YYYY')}</td>
                  <td>{formatBytes(day.get('net_on').get('bytes'))}</td>
                  <td>{numeral(day.get('net_on').get('percent_total')).format('0%')}</td>
                  <td>{formatBytes(day.get('net_off').get('bytes'))}</td>
                  <td>{numeral(day.get('net_off').get('percent_total')).format('0%')}</td>
                  <td>{formatBytes(day.get('total'))}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

AnalysisSPReport.displayName = 'AnalysisSPReport'
AnalysisSPReport.propTypes = {
  fetching: React.PropTypes.bool,
  serviceProviderStats: React.PropTypes.instanceOf(Immutable.Map)
}

module.exports = AnalysisSPReport
