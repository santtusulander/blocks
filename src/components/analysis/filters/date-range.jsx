import React, { PropTypes } from 'react'
import moment from 'moment-timezone'
import { FormattedMessage } from 'react-intl';

import FilterIncludeComparison from './include-comparison.jsx'
import DateRangeSelect from '../../../components/shared/form-elements/date-range-select'

class FilterDateRange extends React.Component {
  constructor(props) {
    super(props)
  }
  componentWillReceiveProps(nextProps) {
    // If user already selected over 4 months date range and then chooses to
    // compare data, we will trim the date range from the end to 4 months long
    const { endDate, startDate } = nextProps
    if (nextProps.includeComparison && endDate.diff(startDate, 'months') >= 4) {
      nextProps.onFilterChange('dateRange', { startDate, endDate: startDate.clone().add(4, 'months').subtract(1, 'day') })
    }
  }
  render() {
    const { onFilterChange, startDate, endDate, showComparison, includeComparison, dateRanges } = this.props
    return (
      <div className='action'>
        <h5><FormattedMessage id="portal.analysis.filters.dateRange.title"/></h5>
        <div className="sidebar-content form-inline">
          <DateRangeSelect
            startDate={startDate}
            endDate={endDate}
            availableRanges={dateRanges}
            limitRange={includeComparison}
            changeDateRange={(newStartDate, newEndDate, activeDateRange) => {
              onFilterChange('dateRange', { startDate: newStartDate, endDate: newEndDate})
              onFilterChange('dateRangeLabel', activeDateRange)
            }}/>
          {showComparison &&
            <FilterIncludeComparison
              includeComparison={includeComparison}
              toggleComparison={val => {
                onFilterChange('includeComparison', val)
              }}/>
          }
        </div>
      </div>
    )
  }
}

FilterDateRange.displayName = 'FilterDateRange'
FilterDateRange.propTypes = {
  dateRanges: PropTypes.array,
  endDate: PropTypes.instanceOf(moment),
  includeComparison: PropTypes.bool,
  onFilterChange: PropTypes.func,
  showComparison: PropTypes.bool,
  startDate: PropTypes.instanceOf(moment)
}
FilterDateRange.defaultProps = {
  dateRanges: []
}

export default FilterDateRange
