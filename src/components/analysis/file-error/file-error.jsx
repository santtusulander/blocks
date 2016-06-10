import React, { PropTypes } from 'react'
import { Col, Row } from 'react-bootstrap'
import { List, Map } from 'immutable'

import AnalysisFileErrorDataBox from './data-box'
import AnalysisURLList from '../url-list'

const AnalysisFileError = props => {
  const { serviceTypes, statusCodes, summary, urls } = props
  let filteredUrls = List()
  serviceTypes.forEach(activeServiceType => {
    statusCodes.forEach(activeStatusCode => {
      filteredUrls = filteredUrls.concat(
        urls.filter(url =>
          url.get('service_type') === activeServiceType &&
          url.get('status_code') === activeStatusCode.toString()
        )
      )
    })
  })

  let filteredErrorSummary = { clientErrs: [], serverErrs: [] }
  for(const err in summary.toJS()) {
    const value = summary.get(err)
    const code = parseInt(err.substring(1))
    if(statusCodes.includes(code)){
      if(code < 500) {
        filteredErrorSummary.clientErrs.push({ value, code })
      }
      else {
        filteredErrorSummary.serverErrs.push({ value, code })
      }
    }
  }
  const { clientErrs, serverErrs } = filteredErrorSummary

  return (
    <div className="analysis-file-error">
      <Row>
        <Col xs={12}>
          <AnalysisFileErrorDataBox
            id="client-errors"
            label="Client errors"
            code="4XX"
            errs={clientErrs}/>
          <AnalysisFileErrorDataBox
            id="server-errors"
            label="Server errors"
            code="5XX"
            errs={serverErrs}
            />
        </Col>
      </Row>
      <h3>HEADER</h3>
      <AnalysisURLList
        urls={filteredUrls}
        labelFormat={url => `${url.get('status_code')} ${url.get('url')}`}/>
    </div>
  )
}

AnalysisFileError.displayName = 'AnalysisFileError'
AnalysisFileError.propTypes = {
  fetching: PropTypes.bool,
  serviceTypes: PropTypes.instanceOf(List),
  statusCodes: PropTypes.instanceOf(List),
  summary: PropTypes.instanceOf(Map),
  urls: PropTypes.instanceOf(List)
}
AnalysisFileError.defaultProps = {
  summary: Map(),
  urls: List()
}

export default AnalysisFileError
