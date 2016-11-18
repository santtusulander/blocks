import React, { PropTypes } from 'react'
import moment from 'moment'
import { FormattedMessage } from 'react-intl';

import CustomDatePicker from '../../../components/custom-date-picker'

const FilterCustomDateRange = ({ onFilterChange, startDate, endDate }) =>
  <div className='action'>
    <h5><FormattedMessage id="portal.analysis.filters.customDateRange.title"/></h5>
    <CustomDatePicker
      startDate={startDate}
      endDate={endDate}
      changeDateRange={(startDate, endDate) => {
        onFilterChange('customDateRange', { startDate, endDate })
      }} />
  </div>

FilterCustomDateRange.displayName = 'FilterCustomDateRange'
FilterCustomDateRange.propTypes = {
  endDate: PropTypes.instanceOf(moment),
  onFilterChange: PropTypes.func,
  startDate: PropTypes.instanceOf(moment)
}

export default FilterCustomDateRange
