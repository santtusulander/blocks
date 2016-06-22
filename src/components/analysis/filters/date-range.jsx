import React from 'react'
import moment from 'moment'

import DateRangeSelect from '../../../components/date-range-select'

export class FilterDateRange extends React.Component {

  render() {
    return (
      <div>
        <div className="sidebar-section-header">
          Date Range
        </div>
        <div className="sidebar-content">
          <DateRangeSelect
            changeDateRange={this.props.changeDateRange}
            endDate={this.props.endDate}
            startDate={this.props.startDate}/>
        </div>
      </div>
    )
  }
}

FilterDateRange.displayName = 'FilterDateRange'
FilterDateRange.propTypes = {
  changeDateRange: React.PropTypes.func,
  endDate: React.PropTypes.instanceOf(moment),
  startDate: React.PropTypes.instanceOf(moment)
}

module.exports = FilterDateRange
