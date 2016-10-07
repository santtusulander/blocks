import React, { PropTypes } from 'react'
import moment from 'moment'
import { FormattedMessage } from 'react-intl';

import FilterIncludeComparison from './include-comparison.jsx'
import DateRangeSelect from '../../../components/date-range-select'
import DateRanges from '../../../constants/date-ranges'


const FilterDateRange = ({ onFilterChange, startDate, endDate, showComparison, includeComparison }) =>
  <div className='action'>
    <h5><FormattedMessage id="portal.analysis.filters.dateRange.title"/></h5>
    <DateRangeSelect
      startDate={startDate}
      endDate={endDate}
      availableRanges={[
        DateRanges.MONTH_TO_DATE,
        DateRanges.LAST_MONTH,
        DateRanges.THIS_WEEK,
        DateRanges.LAST_WEEK,
        DateRanges.TODAY,
        DateRanges.YESTERDAY,
        DateRanges.CUSTOM_TIMERANGE
      ]}
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
  endDate: PropTypes.instanceOf(moment),
  includeComparison: PropTypes.bool,
  onFilterChange: PropTypes.func,
  showComparison: PropTypes.bool,
  startDate: PropTypes.instanceOf(moment)
}

export default FilterDateRange
