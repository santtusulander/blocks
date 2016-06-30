import React, { PropTypes } from 'react'
import { Col, Row } from 'react-bootstrap'
import { List, Map } from 'immutable'

import AnalysisFileErrorDataBox from './data-box'
import AnalysisURLList from '../url-list'

/* find any key in array */
function hasKeys( val, keyList ) {
  if ( keyList.includes('all') ) return true;

  let found = false;
  keyList.some( (key) => {
    if (val.has(key)) {
      found=true;
      return
    }
  })

  return found;
}

const AnalysisFileError = props => {
  const { serviceTypes, statusCodes, summary, urls } = props

  // Summary filtering
  //filter by serviceType
  const filteredErrorSummary = summary.filter( (errorVal) => {
    //error has selected serviceType?
    return ( hasKeys( errorVal, serviceTypes) )
  })
  //filter by error codes (is errorKey included in errorCodes)
  .filter( (errorVal, i) => {
    return statusCodes.includes('All') || statusCodes.includes(i.substr(1))
  })

  //separate server & client errs for KPIs
  let clientErrs=[], serverErrs=[];
  filteredErrorSummary.forEach( (err, key) => {
    const errorCode = parseInt(key.substr(1))
    if ( errorCode < 500 ) clientErrs.push({value: err, code: errorCode})
    else serverErrs.push({value: err, code: errorCode})
  })

  //REFACTOR: Shared code with url-report.jsx
  //URL filtering
  //by serviceType

  const filteredUrls = urls.filter( (url) => {
    return serviceTypes.includes(url.get('service_type'))
  })
  //filter by error code
  .filter( (url) => {
    return statusCodes.includes('All') || statusCodes.includes(url.get('status_code'))
  })

  return (
    <div className="analysis-file-error">
      <Row>
        <Col xs={12}>
          <AnalysisFileErrorDataBox
            id="client-errors"
            label="Client errors"
            code="4XX"
            errs={clientErrs}
          />
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
