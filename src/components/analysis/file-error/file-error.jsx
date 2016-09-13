import React, {PropTypes} from 'react'
import {Col, Row} from 'react-bootstrap'
import {List, Map} from 'immutable'
import {injectIntl} from 'react-intl'

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

function sortByCode(error1, error2) {
  if(error1.code > error2.code) {
    return 1;
  }
  else if (error1.code < error2.code) {
    return -1;
  }
  return 0;
}

const AnalysisFileError = props => {
  const { serviceTypes, statusCodes, summary, urls, intl } = props

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
  clientErrs = clientErrs.sort(sortByCode)
  serverErrs = serverErrs.sort(sortByCode)

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
            label={intl.formatMessage({id: 'portal.analytics.fileErrors.clientErrors.label'})}
            code="4XX"
            errs={clientErrs}
          />
          <AnalysisFileErrorDataBox
            id="server-errors"
            label={intl.formatMessage({id: 'portal.analytics.fileErrors.serverErrors.label'})}
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
  intl: PropTypes.object,
  serviceTypes: PropTypes.instanceOf(List),
  statusCodes: PropTypes.instanceOf(List),
  summary: PropTypes.instanceOf(Map),
  urls: PropTypes.instanceOf(List)
}
AnalysisFileError.defaultProps = {
  summary: Map(),
  urls: List()
}

export default injectIntl(AnalysisFileError)
