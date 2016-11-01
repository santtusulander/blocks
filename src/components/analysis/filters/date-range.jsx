import React, { PropTypes } from 'react'
import moment from 'moment'
import { FormattedMessage } from 'react-intl';

import FilterIncludeComparison from './include-comparison.jsx'
import DateRangeSelect from '../../../components/date-range-select'

const FilterDateRange = ({ onFilterChange, startDate, endDate, showComparison, includeComparison, dateRanges }) =>
  <div className='action'>
    <h5><FormattedMessage id="portal.analysis.filters.dateRange.title"/></h5>
    <DateRangeSelect
      startDate={startDate}
      endDate={endDate}
      availableRanges={dateRanges}
      changeDateRange={(startDate, endDate, activeDateRange) => {
        onFilterChange('dateRange', { startDate, endDate })
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

FilterDateRange.displayName = 'FilterDateRange'
FilterDateRange.propTypes = {
  changeDateRange: PropTypes.func,
  dateRanges: PropTypes.array,
  endDate: PropTypes.instanceOf(moment),
  includeComparison: PropTypes.bool,
  onFilterChange: PropTypes.func,
  showComparison: PropTypes.bool,
  startDate: PropTypes.instanceOf(moment)
}

export default FilterDateRange
