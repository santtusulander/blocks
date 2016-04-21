import React from 'react'
import { Col, Row } from 'react-bootstrap'
import numeral from 'numeral'

import {formatBytes} from '../../util/helpers'

class AnalysisURLReport extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="analysis-url-report">
        <Row>
          <Col xs={12}>
            <div className="analysis-data-box">
              <h4>Client errors</h4>
              <p>4XX</p>
              <Row className="extra-margin-top">
                <Col xs={6} className="text-center right-separator">
                  <p>00</p>
                  <h4>400 Bad request</h4>
                </Col>
                <Col xs={6} className="text-center">
                  <p>00</p>
                  <h4>403 Bad Request</h4>
                </Col>
              </Row>
            </div>
            <div className="analysis-data-box">
              <h4>Server errors</h4>
              <p>5XX</p>
              <Row className="extra-margin-top">
                <Col xs={6} className="text-center right-separator">
                  <p>00</p>
                  <h4>500 Internal Server Error</h4>
                </Col>
                <Col xs={6} className="text-center">
                  <p>00</p>
                  <h4>503 Service Unavailable</h4>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <h3>HEADER</h3>
        <table className="table table-striped table-analysis">
          <thead>
            <tr>
              <th>URL</th>
              <th width="15%">Bytes</th>
              <th width="15%">Requests</th>
              <th width="15%">Seconds</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>www.domain.com/assets/videos/video.mp4</td>
              <td>
                {formatBytes(123544786367)}
                <div className="table-percentage-line">
                  <div className="line" style={{width: '100%'}} />
                </div>
              </td>
              <td>
                {numeral(213678).format('0,0')}
                <div className="table-percentage-line">
                  <div className="line" style={{width: '90%'}} />
                </div>
              </td>
              <td>
                {numeral(82457).format('0,0')}
                <div className="table-percentage-line">
                  <div className="line" style={{width: '50%'}} />
                </div>
              </td>
            </tr>
            <tr>
              <td>www.foobar.com/assets/images/image.jpg</td>
              <td>
                {formatBytes(6541632)}
                <div className="table-percentage-line">
                  <div className="line" style={{width: '80%'}} />
                </div>
              </td>
              <td>
                {numeral(987).format('0,0')}
                <div className="table-percentage-line">
                  <div className="line" style={{width: '70%'}} />
                </div>
              </td>
              <td>
                {numeral(213678).format('0,0')}
                <div className="table-percentage-line">
                  <div className="line" style={{width: '90%'}} />
                </div>
              </td>
            </tr>
            <tr>
              <td>www.domain.com/favicon.ico</td>
              <td>
                {formatBytes(9871)}
                <div className="table-percentage-line">
                  <div className="line" style={{width: '60%'}} />
                </div>
              </td>
              <td>
                {numeral(987123).format('0,0')}
                <div className="table-percentage-line">
                  <div className="line" style={{width: '50%'}} />
                </div>
              </td>
              <td>
                {numeral(934875).format('0,0')}
                <div className="table-percentage-line">
                  <div className="line" style={{width: '80%'}} />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

AnalysisURLReport.displayName = 'AnalysisURLReport'
AnalysisURLReport.propTypes = {
  fetching: React.PropTypes.bool
}

module.exports = AnalysisURLReport
