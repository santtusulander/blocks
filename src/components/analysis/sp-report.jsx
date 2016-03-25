import React from 'react'
import { Col, Row } from 'react-bootstrap'
import numeral from 'numeral'
import moment from 'moment'
import Immutable from 'immutable'


import AnalysisByTime from './by-time'

class AnalysisSPReport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      byTimeWidth: 100
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
      byTimeWidth: this.refs.byTimeHolder.clientWidth
    })
  }
  render() {
    const httpData = this.props.serviceTypes.includes('http') ?
      this.props.byTime.filter(time => time.get('service_type') === 'http')
      : Immutable.List()
    const httpsData = this.props.serviceTypes.includes('https') ?
      this.props.byTime.filter(time => time.get('service_type') === 'https')
      : Immutable.List()
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
          </Col>
        </Row>
        <h3>TRAFFIC OVER TIME</h3>
        <div ref="byTimeHolder">
          {this.props.fetching ?
            <div>Loading...</div> :
            <AnalysisByTime axes={true} padding={40}
              dataKey="bytes"
              primaryData={httpData.toJS()}
              secondaryData={httpsData.toJS()}
              width={this.state.byTimeWidth} height={this.state.byTimeWidth / 3}/>
            }
        </div>
        <table className="table table-striped table-analysis extra-margin-top">
          <thead>
            <tr>
              <th>Date</th>
              <th>On-Net in GB</th>
              <th>On-Net in %</th>
              <th>Off-Net in GB</th>
              <th>Off-Net in %</th>
              <th>Total in GB</th>
            </tr>
          </thead>
          <tbody>
            {this.props.byCountry.map((country, i) => {
              const totalBytes = country.get('detail').reduce((total, traffic) => {
                return total + traffic.get('bytes')
              }, 0)
              const startBytes = country.get('detail').first().get('bytes')
              const endBytes = country.get('detail').last().get('bytes')
              let trending = startBytes / endBytes
              if(isNaN(trending)) {
                trending = 'N/A'
              }
              else if(trending > 1) {
                trending = numeral((trending - 1) * -1).format('0%')
              }
              else {
                trending = numeral(trending).format('+0%');
              }
              let formattedBytes = numeral(totalBytes / 100000000).format('0,0')+' GB'
              if(totalBytes < 1000) {
                formattedBytes = numeral(totalBytes).format('0,0')+' B'

              }
              else if(totalBytes < 1000000) {
                formattedBytes = numeral(totalBytes / 1000).format('0,0')+' KB'

              }
              else if(totalBytes < 100000000) {
                formattedBytes = numeral(totalBytes / 1000000).format('0,0')+' MB'

              }
              return (
                <tr key={i}>
                  <td>{country.get('name')}</td>
                  <td>{formattedBytes}</td>
                  <td>{numeral(country.get('percent_total')).format('0%')}</td>
                  <td>{trending}</td>
                  <td>{trending}</td>
                  <td>{trending}</td>
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
  byCountry: React.PropTypes.instanceOf(Immutable.List),
  byTime: React.PropTypes.instanceOf(Immutable.List),
  fetching: React.PropTypes.bool,
  serviceTypes: React.PropTypes.instanceOf(Immutable.List),
  totalEgress: React.PropTypes.number
}

module.exports = AnalysisSPReport
