import React from 'react'
import { FormattedMessage } from 'react-intl';

import Select from '../../../components/shared/form-elements/select'


export class FilterChartType extends React.Component {
  render() {
    return (
      <div>
        <h5><FormattedMessage id="portal.analysis.filters.chart.title"/></h5>
        <div className="sidebar-content">
          <div className="form-group">
            <Select className="btn-block"
              onSelect={this.props.changeType}
              value={this.props.value}
              options={[
                ['bar', 'Bar Chart'],
                ['line', 'Line Chart']]}/>
          </div>
        </div>
      </div>
    );
  }
}

FilterChartType.displayName = 'FilterChartType'
FilterChartType.propTypes = {
  changeType: React.PropTypes.func,
  value: React.PropTypes.string
}

module.exports = FilterChartType
