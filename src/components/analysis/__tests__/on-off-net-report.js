import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../on-off-net-report.jsx')
jest.dontMock('../../table-sorter.jsx')

const AnalysisOnOffNetReport = require('../on-off-net-report.jsx')

// Set up mocks to make sure formatting libs are used correctly
const moment = require('moment')
const numeral = require('numeral')

const momentFormatMock = jest.genMockFunction()
const numeralFormatMock = jest.genMockFunction()

moment.mockReturnValue({format:momentFormatMock})
numeral.mockReturnValue({format:numeralFormatMock})

const fakeOnOffStats = Immutable.fromJS({
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

const fakeOnOffStatsToday = Immutable.fromJS({
 total: 123456,
 net_on: {bytes: 123, percent_total: 0.2},
 net_off: {bytes: 456, percent_total: 0.8}
})

describe('AnalysisOnOffNetReport', () => {
  it('should exist', () => {
    let analysisOnOffNetReport = TestUtils.renderIntoDocument(
      <AnalysisOnOffNetReport
        fetching={true}
        onOffStats={fakeOnOffStats}
        onOffStatsToday={fakeOnOffStatsToday}/>
    );
    expect(TestUtils.isCompositeComponent(analysisOnOffNetReport)).toBeTruthy();
  });

  it('should show data rows in table', () => {
    let analysisOnOffNetReport = TestUtils.renderIntoDocument(
      <AnalysisOnOffNetReport
        fetching={false}
        onOffStats={fakeOnOffStats}
        onOffStatsToday={fakeOnOffStatsToday}/>
    );
    let trs = TestUtils.scryRenderedDOMComponentsWithTag(analysisOnOffNetReport, 'tr')
    expect(trs.length).toBe(3);
  });

  it('should show summary stats', () => {
    moment.mockClear()
    numeral.mockClear()
    TestUtils.renderIntoDocument(
      <AnalysisOnOffNetReport
        fetching={false}
        onOffStats={fakeOnOffStats}
        onOffStatsToday={fakeOnOffStatsToday}/>
    );
    expect(numeral.mock.calls.length).toBe(8)
    expect(numeral.mock.calls[0]).toEqual([0.5])
    expect(numeralFormatMock.mock.calls[0][0]).toBe('0%')
  });
})
