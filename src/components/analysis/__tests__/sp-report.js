import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../sp-report.jsx')
jest.dontMock('../../table-sorter.jsx')

const AnalysisSPReport = require('../sp-report.jsx')

// Set up mocks to make sure formatting libs are used correctly
const moment = require('moment')
const numeral = require('numeral')

const momentFormatMock = jest.genMockFunction()
const numeralFormatMock = jest.genMockFunction()

moment.mockReturnValue({format:momentFormatMock})
numeral.mockReturnValue({format:numeralFormatMock})

const fakeServiceProviderStats = Immutable.fromJS({
 total: 31000000,
 net_on: {bytes: 500000, percent_total: 0.5},
 net_off: {bytes: 500000, percent_total: 0.5},
 detail: [{
   timestamp: new Date(1451606400 * 1000),
   total: 1000000,
   net_on: {bytes: 500000, percent_total: 0.5},
   net_off: {bytes: 500000, percent_total: 0.5}
 }, {
   timestamp: new Date(1451692800 * 1000),
   total: 1000000,
   net_on: {bytes: 500000, percent_total: 0.5},
   net_off: {bytes: 500000, percent_total: 0.5}
 }]
})

const fakeServiceProviderStatsToday = Immutable.fromJS({
 total: 123456,
 net_on: {bytes: 123, percent_total: 0.2},
 net_off: {bytes: 456, percent_total: 0.8}
})

describe('AnalysisSPReport', () => {
  it('should exist', () => {
    let analysisSPReport = TestUtils.renderIntoDocument(
      <AnalysisSPReport
        fetching={true}
        serviceProviderStats={fakeServiceProviderStats}
        serviceProviderStatsToday={fakeServiceProviderStatsToday}/>
    );
    expect(TestUtils.isCompositeComponent(analysisSPReport)).toBeTruthy();
  });

  it('should show data rows in table', () => {
    let analysisSPReport = TestUtils.renderIntoDocument(
      <AnalysisSPReport
        fetching={false}
        serviceProviderStats={fakeServiceProviderStats}
        serviceProviderStatsToday={fakeServiceProviderStatsToday}/>
    );
    let trs = TestUtils.scryRenderedDOMComponentsWithTag(analysisSPReport, 'tr')
    expect(trs.length).toBe(3);
  });

  it('should show summary stats', () => {
    moment.mockClear()
    numeral.mockClear()
    TestUtils.renderIntoDocument(
      <AnalysisSPReport
        fetching={false}
        serviceProviderStats={fakeServiceProviderStats}
        serviceProviderStatsToday={fakeServiceProviderStatsToday}/>
    );
    expect(numeral.mock.calls.length).toBe(16)
    expect(numeral.mock.calls[0]).toEqual([0.2])
    expect(numeralFormatMock.mock.calls[0][0]).toBe('0,0%')
  });
})
