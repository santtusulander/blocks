import React from 'react'
import TestUtils from 'react-addons-test-utils'

// Set up mocks to make sure formatting libs are used correctly
/*const moment = require('moment')
const momentFormatMock = jest.genMockFunction()
const momentStartOfMock = jest.genMockFunction()
const momentEndOfMock = jest.genMockFunction()
const momentUtcMock = jest.genMockFunction()
moment.mockReturnValue({
  format: momentFormatMock,
  startOf: momentStartOfMock,
  endOf: momentEndOfMock,
  utc: momentUtcMock
})
*/
jest.dontMock('../date-range-select.jsx')
const DateRange = require('../date-range-select.jsx')
import moment from 'moment'

describe('DateRangeSelect', () => {
  it('should exist', () => {
    const filter = TestUtils.renderIntoDocument(
      <DateRange
        startDate={moment()}
        endDate={moment()}
        availableRanges={[1]}/>
    )
    expect(TestUtils.isCompositeComponent(filter)).toBeTruthy()
  })

  // TODO: Need to figure out how to mock moment values
  // it('should handle start date change ', () => {
  //   const changeDateRange = jest.genMockFunction()
  //   let filters = TestUtils.renderIntoDocument(
  //     <Filters serviceTypes={mockServiceTypes} endDate={10}
  //       changeDateRange={changeDateRange} />
  //   );
  //   filters.handleStartDateChange()
  //   expect(changeDateRange.mock.calls.length).toBe(1)
  //   expect(changeDateRange.mock.calls[0][1]).toEqual(11)
  // });
  //
  // it('should handle end date change ', () => {
  //   const changeDateRange = jest.genMockFunction()
  //   let filters = TestUtils.renderIntoDocument(
  //     <Filters serviceTypes={mockServiceTypes} startDate={10}
  //       changeDateRange={changeDateRange} />
  //   );
  //   filters.handleOnFocus()
  //   filters.handleEndDateChange(new Date("2016-01-02 00:00:00"))
  //   expect(changeDateRange.mock.calls.length).toBe(1)
  //   expect(changeDateRange.mock.calls[0][0]).toEqual(9)
  //   expect(changeDateRange.mock.calls[0][1]).toEqual(9)
  //   expect(filters.state.datepickerOpen).toBe(false)
  // });

  it('should handle datepicker focus and blur', () => {
    const filter = TestUtils.renderIntoDocument(
      <DateRange
        startDate={moment()}
        endDate={moment()}
        availableRanges={[1]}/>
    )
    expect(filter.state.datepickerOpen).toBe(false)
    filter.handleOnFocus()
    expect(filter.state.datepickerOpen).toBe(true)
    filter.handleOnBlur()
    expect(filter.state.datepickerOpen).toBe(false)
  })

  // TODO: Need to figure out how to mock moment values
  // it('should handle date range change', () => {
  //   const changeDateRange = jest.genMockFunction()
  //   let filters = TestUtils.renderIntoDocument(
  //     <Filters serviceTypes={mockServiceTypes}
  //       startDate={new Date("2016-01-02 00:00:00")}
  //       changeDateRange={changeDateRange} />
  //   );
  //   expect(filters.state.activeDateRange).toBe('month_to_date')
  //   filters.handleTimespanChange('week_to_date')
  //   expect(changeDateRange.mock.calls.length).toBe(1)
  //   expect(filters.state.activeDateRange).toBe('week_to_date')
  //   filters.handleTimespanChange('month_to_date')
  //   expect(changeDateRange.mock.calls.length).toBe(2)
  //   expect(filters.state.activeDateRange).toBe('month_to_date')
  //   filters.handleTimespanChange('today')
  //   expect(changeDateRange.mock.calls.length).toBe(3)
  //   expect(filters.state.activeDateRange).toBe('today')
  // });
})
