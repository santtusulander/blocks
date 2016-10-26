import React from 'react';
import moment from 'moment'
import { storiesOf } from '@kadira/storybook';

const ThemeWrap       = require('../theme-wrap.jsx');
const DateRangeFilter = require('../../analysis/filters/date-range-filter/date-range-filter.jsx');

const dates = {
  startDate: moment().utc(),
  endDate: moment().utc().startOf('month')
}

const handleDateRangeChange = (startDate, endDate) => {
  dates.startDate = startDate
  dates.endDate = endDate
}

storiesOf('DateRangeFilter', module)
  .addDecorator((story) => (
    <ThemeWrap >
      {story()}
    </ThemeWrap>
  ))
  .add('DateRangeFilter', () => (
    <div style={{width: '40%'}}>
      <DateRangeFilter
        changeDateRange={handleDateRangeChange}
        endDate={dates.startDate}
        startDate={dates.endDate}/>
    </div>
  ))
