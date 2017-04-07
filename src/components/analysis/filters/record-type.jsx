import React from 'react'
import { Radio, FormGroup } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

function FilterRecordType ({ recordType = '', toggleRecordType }) {
  return (
    <div>
      <h5><FormattedMessage id="portal.analysis.filters.recordType.title"/></h5>
      <div className="sidebar-content form-inline">
        <FormGroup>
          <Radio
            checked={recordType.includes('transfer_rates')}
            onChange={() => toggleRecordType('transfer_rates')}>
            <span><FormattedMessage id="portal.analytics.trafficOverview.byCountry.bandwidth.header"/></span>
          </Radio>
        </FormGroup>
        <FormGroup>
          <Radio
            checked={recordType.includes('requests')}
            onChange={() => toggleRecordType('requests')}>
           <span><FormattedMessage id="portal.analytics.trafficOverview.byCountry.request.header"/></span>
          </Radio>
        </FormGroup>
      </div>
    </div>
  )
}

FilterRecordType.displayName = 'FilterRecordType'
FilterRecordType.propTypes = {
  recordType: React.PropTypes.string,
  toggleRecordType: React.PropTypes.func
}

export default FilterRecordType
