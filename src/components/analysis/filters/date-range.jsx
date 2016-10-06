import React from 'react'
import moment from 'moment'
import { FormattedMessage } from 'react-intl';

import DateRangeSelect from '../../../components/date-range-select'
import DateRanges from '../../../constants/date-ranges'


export class FilterDateRange extends React.Component {

  render() {
    return (
      <div>
        <h5><FormattedMessage id="portal.analysis.filters.dateRange.title"/></h5>
        <div className="sidebar-content">
          <DateRangeSelect
            changeDateRange={this.props.changeDateRange}
            endDate={this.props.endDate}
            startDate={this.props.startDate}
            availableRanges={[
              DateRanges.MONTH_TO_DATE,
              DateRanges.LAST_MONTH,
              DateRanges.LAST_WEEK,
              DateRanges.THIS_WEEK,
              DateRanges.TODAY,
              DateRanges.YESTERDAY,
              DateRanges.CUSTOM_TIMERANGE
            ]}/>
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
