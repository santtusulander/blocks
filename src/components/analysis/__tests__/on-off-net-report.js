import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.autoMockOff()
jest.dontMock('../on-off-net-report.jsx')
jest.dontMock('../../table-sorter.jsx')

const AnalysisOnOffNetReport = require('../on-off-net-report.jsx')

// Set up mocks to make sure formatting libs are used correctly
const moment = require('moment')
const numeral = require('numeral')

moment.format = jest.fn()
numeral.format = jest.fn()

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

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('AnalysisOnOffNetReport', () => {
  it('should exist', () => {
    let analysisOnOffNetReport = TestUtils.renderIntoDocument(
      <AnalysisOnOffNetReport
        fetching={true}
        onOffStats={fakeOnOffStats}
        onOffStatsToday={fakeOnOffStatsToday}
        intl={intlMaker()}/>
    );
    expect(TestUtils.isCompositeComponent(analysisOnOffNetReport)).toBeTruthy();
  });

  it('should show data rows in table', () => {
    let analysisOnOffNetReport = TestUtils.renderIntoDocument(
      <AnalysisOnOffNetReport
        fetching={false}
        onOffStats={fakeOnOffStats}
        onOffStatsToday={fakeOnOffStatsToday}
        intl={intlMaker()}/>
    );
    let trs = TestUtils.scryRenderedDOMComponentsWithTag(analysisOnOffNetReport, 'tr')
    expect(trs.length).toBe(3);
  });

  it('should show summary stats', () => {
    let analysisOnOffNetReport = TestUtils.renderIntoDocument(
      <AnalysisOnOffNetReport
        fetching={false}
        onOffStats={fakeOnOffStats}
        onOffStatsToday={fakeOnOffStatsToday}
        intl={intlMaker()}/>
    );
    let summaryBoxes = TestUtils.scryRenderedDOMComponentsWithClass(analysisOnOffNetReport, 'analysis-data-box')
    expect(summaryBoxes[0].textContent).toContain('123 KB')
    expect(summaryBoxes[1].textContent).toContain('31 MB')
  });
})
