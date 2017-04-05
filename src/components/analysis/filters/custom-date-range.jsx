import React, { PropTypes } from 'react'
import moment from 'moment'
import { FormattedMessage } from 'react-intl';

import CustomDatePicker from '../../../components/custom-date-picker'

const FilterCustomDateRange = ({ onFilterChange, startDate }) =>
  <div className='action'>
    <h5><FormattedMessage id="portal.analysis.filters.customDateRange.title"/></h5>
    <CustomDatePicker
      startDate={startDate}
      changeDateRange={(newStartDate, newEndDate) => {
        onFilterChange('customDateRange', { startDate: newStartDate, endDate: newEndDate })
      }} />
  </div>

FilterCustomDateRange.displayName = 'FilterCustomDateRange'
FilterCustomDateRange.propTypes = {
  onFilterChange: PropTypes.func,
  startDate: PropTypes.instanceOf(moment)
}

export default FilterCustomDateRange
