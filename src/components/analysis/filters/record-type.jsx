import React from 'react'
import { Input } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

export class FilterRecordType extends React.Component {
  render() {
    return (
      <div>
        <h5><FormattedMessage id="portal.analysis.filters.recordType.title"/></h5>
        <div className="sidebar-content form-inline">
          <Input type="radio" label="Bandwidth"
            checked={this.props.recordType.includes('transfer_rates')}
            onChange={() => this.props.toggleRecordType('transfer_rates')}/>
          <Input type="radio" label="Requests"
            checked={this.props.recordType.includes('requests')}
            onChange={() => this.props.toggleRecordType('requests')}/>
        </div>
      </div>
    );
  }
}

FilterRecordType.displayName = 'FilterServiceType'
FilterRecordType.propTypes = {
  recordType: React.PropTypes.string,
  toggleRecordType: React.PropTypes.func
}

module.exports = FilterRecordType
