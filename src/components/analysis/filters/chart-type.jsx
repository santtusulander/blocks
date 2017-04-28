import React from 'react'
import { FormattedMessage } from 'react-intl';

import Select from '../../../components/shared/form-elements/select'


const FilterChartType = (props) => {
  return (
    <div>
      <h5><FormattedMessage id="portal.analysis.filters.chart.title"/></h5>
      <div className="sidebar-content">
        <div className="form-group">
          <Select className="btn-block"
            onSelect={props.changeType}
            value={props.value}
            options={[
              ['bar', 'Bar Chart'],
              ['line', 'Line Chart']]}/>
        </div>
      </div>
    </div>
  )
}

FilterChartType.displayName = 'FilterChartType'
FilterChartType.propTypes = {
  changeType: React.PropTypes.func,
  value: React.PropTypes.string
}

export default FilterChartType
