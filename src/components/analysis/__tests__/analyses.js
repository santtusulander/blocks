import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.dontMock('../analyses.jsx')
const Analyses = require('../analyses.jsx')

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

describe('Analyses', () => {
  it('should exist', () => {
    let analyses = TestUtils.renderIntoDocument(
      <Analyses serviceTypes={mockServiceTypes}/>
    );
    expect(TestUtils.isCompositeComponent(analyses)).toBeTruthy();
  });

  // TODO: Need to figure out how to mock moment values
  // it('should handle start date change ', () => {
  //   const changeDateRange = jest.genMockFunction()
  //   let analyses = TestUtils.renderIntoDocument(
  //     <Analyses serviceTypes={mockServiceTypes} endDate={10}
  //       changeDateRange={changeDateRange} />
  //   );
  //   analyses.handleStartDateChange()
  //   expect(changeDateRange.mock.calls.length).toBe(1)
  //   expect(changeDateRange.mock.calls[0][1]).toEqual(11)
  // });
  //
  // it('should handle end date change ', () => {
  //   const changeDateRange = jest.genMockFunction()
  //   let analyses = TestUtils.renderIntoDocument(
  //     <Analyses serviceTypes={mockServiceTypes} startDate={10}
  //       changeDateRange={changeDateRange} />
  //   );
  //   analyses.handleOnFocus()
  //   analyses.handleEndDateChange(new Date("2016-01-02 00:00:00"))
  //   expect(changeDateRange.mock.calls.length).toBe(1)
  //   expect(changeDateRange.mock.calls[0][0]).toEqual(9)
  //   expect(changeDateRange.mock.calls[0][1]).toEqual(9)
  //   expect(analyses.state.datepickerOpen).toBe(false)
  // });

  it('should handle datepicker focus and blur', () => {
    let analyses = TestUtils.renderIntoDocument(
      <Analyses serviceTypes={mockServiceTypes}/>
    );
    expect(analyses.state.datepickerOpen).toBe(false)
    analyses.handleOnFocus()
    expect(analyses.state.datepickerOpen).toBe(true)
    analyses.handleOnBlur()
    expect(analyses.state.datepickerOpen).toBe(false)
  });

  // TODO: Need to figure out how to mock moment values
  // it('should handle date range change', () => {
  //   const changeDateRange = jest.genMockFunction()
  //   let analyses = TestUtils.renderIntoDocument(
  //     <Analyses serviceTypes={mockServiceTypes}
  //       startDate={new Date("2016-01-02 00:00:00")}
  //       changeDateRange={changeDateRange} />
  //   );
  //   expect(analyses.state.activeDateRange).toBe('month_to_date')
  //   analyses.handleTimespanChange('week_to_date')
  //   expect(changeDateRange.mock.calls.length).toBe(1)
  //   expect(analyses.state.activeDateRange).toBe('week_to_date')
  //   analyses.handleTimespanChange('month_to_date')
  //   expect(changeDateRange.mock.calls.length).toBe(2)
  //   expect(analyses.state.activeDateRange).toBe('month_to_date')
  //   analyses.handleTimespanChange('today')
  //   expect(changeDateRange.mock.calls.length).toBe(3)
  //   expect(analyses.state.activeDateRange).toBe('today')
  // });

  it('should change service provider', () => {
    let analyses = TestUtils.renderIntoDocument(
      <Analyses serviceTypes={mockServiceTypes}/>
    );
    expect(analyses.state.activeServiceProvider).toBe('all')
    analyses.handleServiceProviderChange('foo')
    expect(analyses.state.activeServiceProvider).toBe('foo')
  });

  it('should change pop', () => {
    let analyses = TestUtils.renderIntoDocument(
      <Analyses serviceTypes={mockServiceTypes}/>
    );
    expect(analyses.state.activePop).toBe('all')
    analyses.handlePopChange('foo')
    expect(analyses.state.activePop).toBe('foo')
  });

  it('should change on off net chart type', () => {
    const changeOnOffNetChartType = jest.genMockFunction()
    let analyses = TestUtils.renderIntoDocument(
      <Analyses serviceTypes={mockServiceTypes}
        changeOnOffNetChartType={changeOnOffNetChartType}/>
    );
    analyses.handleChartTypeChange('foo')
    expect(changeOnOffNetChartType.mock.calls[0][0]).toEqual('foo')
  });

  it('should toggle service types', () => {
    const toggleServiceType = jest.genMockFunction()
    let analyses = TestUtils.renderIntoDocument(
      <Analyses serviceTypes={mockServiceTypes}
        toggleServiceType={toggleServiceType}/>
    );
    analyses.toggleServiceType('zyx')()
    expect(toggleServiceType.mock.calls.length).toBe(1)
    expect(toggleServiceType.mock.calls[0][0]).toEqual('zyx')
  });

  it('should toggle the nav menu', () => {
    let analyses = TestUtils.renderIntoDocument(
      <Analyses serviceTypes={mockServiceTypes}/>
    );
    expect(analyses.state.navMenuOpen).toBe(false)
    analyses.toggleNavMenu()
    expect(analyses.state.navMenuOpen).toBe(true)
  });
})
