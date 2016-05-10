import React from 'react'
import { Col, Row } from 'react-bootstrap'
import numeral from 'numeral'
import Immutable from 'immutable'

import {formatBytes} from '../../../util/helpers'
import AnalysisFileErrorDataBox from './data-box'

class AnalysisFileError extends React.Component {
  render() {
    const {serverErrs, clientErrs} = this.props.summary.entrySeq().reduce(
      (totals, summary) => {
        const code = parseInt(summary[0].substring(1))
        totals[code < 500 ? 'clientErrs' : 'serverErrs'].push({
          code: code,
          value: summary[1]
        })
        return totals
      }, {serverErrs: [], clientErrs: []}
    )
    return (
      <div className="analysis-file-error">
        <Row>
          <Col xs={12}>
            <AnalysisFileErrorDataBox
              label="Client errors"
              code="4XX"
              errs={clientErrs}/>
            <AnalysisFileErrorDataBox
              label="Server errors"
              code="5XX"
              errs={serverErrs}/>
          </Col>
        </Row>
        <h3>HEADER</h3>
        <table className="table table-striped table-analysis">
          <thead>
            <tr>
              <th>URL</th>
              <th width="20%">Bytes</th>
              <th width="20%">Requests</th>
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
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

AnalysisFileError.displayName = 'AnalysisFileError'
AnalysisFileError.propTypes = {
  fetching: React.PropTypes.bool,
  summary: React.PropTypes.instanceOf(Immutable.Map),
  urls: React.PropTypes.instanceOf(Immutable.List)
}

module.exports = AnalysisFileError
