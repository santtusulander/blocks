import React from 'react'
import { Col, Row } from 'react-bootstrap'
import Immutable from 'immutable'

import AnalysisFileErrorDataBox from './data-box'
import AnalysisURLList from '../url-list'

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
        <AnalysisURLList
          urls={this.props.urls}
          labelFormat={url => `${url.get('status_code')} ${url.get('url')}`}/>
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
AnalysisFileError.defaultProps = {
  summary: Immutable.Map(),
  urls: Immutable.List()
}

module.exports = AnalysisFileError
