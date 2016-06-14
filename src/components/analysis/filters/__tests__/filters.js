import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.dontMock('../filters.jsx')
const Filters = require('../filters.jsx')

const mockServiceTypes = Immutable.List(['foo', 'bar'])

// Set up mocks to make sure formatting libs are used correctly
const moment = require('moment')
const momentStartOfMock = jest.genMockFunction()
const momentEndOfMock = jest.genMockFunction()
const momentUtcMock = jest.genMockFunction()
moment.mockReturnValue({
  startOf: momentStartOfMock,
  endOf: momentEndOfMock,
  utc: momentUtcMock
})

describe('Filters', () => {
  it('should exist', () => {
    let filters = TestUtils.renderIntoDocument(
      <Filters serviceTypes={mockServiceTypes}/>
    );
    expect(TestUtils.isCompositeComponent(filters)).toBeTruthy();
  });

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
    let filters = TestUtils.renderIntoDocument(
      <Filters serviceTypes={mockServiceTypes}/>
    );
    expect(filters.state.datepickerOpen).toBe(false)
    filters.handleOnFocus()
    expect(filters.state.datepickerOpen).toBe(true)
    filters.handleOnBlur()
    expect(filters.state.datepickerOpen).toBe(false)
  });

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

  it('should change service provider', () => {
    let filters = TestUtils.renderIntoDocument(
      <Filters serviceTypes={mockServiceTypes}/>
    );
    expect(filters.state.activeServiceProvider).toBe('all')
    filters.handleServiceProviderChange('foo')
    expect(filters.state.activeServiceProvider).toBe('foo')
  });

  it('should change pop', () => {
    let filters = TestUtils.renderIntoDocument(
      <Filters serviceTypes={mockServiceTypes}/>
    );
    expect(filters.state.activePop).toBe('all')
    filters.handlePopChange('foo')
    expect(filters.state.activePop).toBe('foo')
  });

  it('should change on off net chart type', () => {
    const changeOnOffNetChartType = jest.genMockFunction()
    let filters = TestUtils.renderIntoDocument(
      <Filters serviceTypes={mockServiceTypes}
        changeOnOffNetChartType={changeOnOffNetChartType}/>
    );
    filters.handleOnOffNetChartTypeChange('foo')
    expect(changeOnOffNetChartType.mock.calls[0][0]).toEqual('foo')
  });

  it('should toggle service types', () => {
    const toggleServiceType = jest.genMockFunction()
    let filters = TestUtils.renderIntoDocument(
      <Filters serviceTypes={mockServiceTypes}
        toggleServiceType={toggleServiceType}/>
    );
    filters.toggleServiceType('zyx')()
    expect(toggleServiceType.mock.calls.length).toBe(1)
    expect(toggleServiceType.mock.calls[0][0]).toEqual('zyx')
  });

  it('should toggle the nav menu', () => {
    let filters = TestUtils.renderIntoDocument(
      <Filters serviceTypes={mockServiceTypes}/>
    );
    expect(filters.state.navMenuOpen).toBe(false)
    filters.toggleNavMenu()
    expect(filters.state.navMenuOpen).toBe(true)
  });
})
