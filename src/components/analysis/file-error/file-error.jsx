import React, { PropTypes } from 'react'
import { Col, Row, FormControl, FormGroup } from 'react-bootstrap'
import { List, Map } from 'immutable'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'

import SectionHeader from '../../layout/section-header'
import SectionContainer from '../../layout/section-container'
import AnalysisFileErrorDataBox from './data-box'
import AnalysisURLList from '../url-list'

class AnalysisFileError extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: ''
    }

    this.changeSearch = this.changeSearch.bind(this)
  }

  changeSearch(event) {
    this.setState({
      search: event.target.value
    })
  }

  hasKeys(val, keyList) {
    if (keyList.includes('all')) {return true;}

    let found = false
    // eslint-disable-next-line array-callback-return
    keyList.some((key) => {
      if (val.has(key)) {
        found = true;
        // eslint-disable-next-line array-callback-return
        return
      }
    })
    return found;
  }

  sortByCode(error1, error2) {
    if (error1.code > error2.code) {
      return 1;
    }
    else if (error1.code < error2.code) {
      return -1;
    }
    return 0;
  }

  render() {
    const { serviceTypes, statusCodes, summary, urls, intl } = this.props

    // Summary filtering
    //filter by serviceType
    const filteredErrorSummary = summary.filter((errorVal) => {
      //error has selected serviceType?
      return (this.hasKeys(errorVal, serviceTypes))
    })
    //filter by error codes (is errorKey included in errorCodes)
    .filter((errorVal, i) => {
      return !statusCodes.size || statusCodes.includes(parseInt(i.substr(1)))
    })

    //separate server & client errs for KPIs
    let clientErrs=[], serverErrs=[];
    filteredErrorSummary.forEach((err, key) => {
      const errorCode = parseInt(key.substr(1))
      if (errorCode < 500) {clientErrs.push({value: err, code: errorCode})}
      else {serverErrs.push({value: err, code: errorCode})}
    })
    clientErrs = clientErrs.sort(this.sortByCode)
    serverErrs = serverErrs.sort(this.sortByCode)

    //REFACTOR: Shared code with url-report.jsx
    //URL filtering
    //by serviceType

    const filteredUrls = urls.filter((url) => {
      return serviceTypes.includes(url.get('service_type'))
    })
    //filter by error code
    .filter((url) => {
      return !statusCodes.size || statusCodes.includes(parseInt(url.get('status_code')))
    })

    return (
      <div>
        <SectionContainer className="analysis-file-error">
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
        </SectionContainer>

        <SectionHeader sectionHeaderTitle={<FormattedMessage id="portal.analytics.fileErrors.label"/>}>
          <FormGroup className="search-input-group">
            <FormControl
              className="search-input"
              placeholder={intl.formatMessage({id: 'portal.analytics.urlList.searchForUrl.text'})}
              value={this.state.search}
              onChange={this.changeSearch}/>
        </FormGroup>
        </SectionHeader>
        <SectionContainer>
          <AnalysisURLList
            urls={filteredUrls}
            labelFormat={url => `${url.get('status_code')} ${url.get('url')}`}
            searchState={this.state.search} />
        </SectionContainer>
      </div>
    )
  }
}

AnalysisFileError.displayName = 'AnalysisFileError'
AnalysisFileError.propTypes = {
  intl: intlShape.isRequired,
  serviceTypes: PropTypes.instanceOf(List),
  statusCodes: PropTypes.instanceOf(List),
  summary: PropTypes.instanceOf(Map),
  urls: PropTypes.instanceOf(List)
}
AnalysisFileError.defaultProps = {
  summary: Map(),
  urls: List()
}

module.exports = injectIntl(AnalysisFileError)
