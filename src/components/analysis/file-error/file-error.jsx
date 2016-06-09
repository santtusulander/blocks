import React, { PropTypes } from 'react'
import { Col, Row } from 'react-bootstrap'
import { List, Map } from 'immutable'

import AnalysisFileErrorDataBox from './data-box'
import AnalysisURLList from '../url-list'

const AnalysisFileError = props => {
  const { serviceTypes, summary, urls } = props
  let filteredUrls = List()
  serviceTypes.forEach(item => {
    filteredUrls = filteredUrls.concat(
      urls.filter(url => url.get('service_type') === item)
    )
  })
  const {serverErrs, clientErrs} = summary
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
            errs={serverErrs}
            />
        </Col>
      </Row>
      <h3>HEADER</h3>
      <AnalysisURLList
        urls={urls}
        labelFormat={url => `${url.get('status_code')} ${url.get('url')}`}/>
    </div>
  )
}

AnalysisFileError.displayName = 'AnalysisFileError'
AnalysisFileError.propTypes = {
  fetching: PropTypes.bool,
  serviceTypes: PropTypes.instanceOf(List),
  summary: PropTypes.instanceOf(Map),
  urls: PropTypes.instanceOf(List)
}
AnalysisFileError.defaultProps = {
  summary: Map(),
  urls: List()
}

export default AnalysisFileError
