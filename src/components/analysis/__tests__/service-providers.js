import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../service-providers.jsx')
jest.dontMock('../../table-sorter.jsx')

const AnalysisServiceProviders = require('../service-providers.jsx')

// Set up mocks to make sure formatting libs are used correctly
const moment = require('moment')
const numeral = require('numeral')

const momentFormatMock = jest.genMockFunction()
const numeralFormatMock = jest.genMockFunction()

moment.mockReturnValue({format:momentFormatMock})
numeral.mockReturnValue({format:numeralFormatMock})

const fakeStats = Immutable.fromJS({
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

const fakeStatsToday = Immutable.fromJS({
 total: 123456,
 net_on: {bytes: 123, percent_total: 0.2},
 net_off: {bytes: 456, percent_total: 0.8}
})

describe('AnalysisServiceProviders', () => {
  it('should exist', () => {
    const analysisServiceProviders = TestUtils.renderIntoDocument(
      <AnalysisServiceProviders
        fetching={true}
        stats={fakeStats}
        statsToday={fakeStatsToday}/>
    );
    expect(TestUtils.isCompositeComponent(analysisServiceProviders)).toBeTruthy();
  });

  it('should show data rows in table', () => {
    const analysisServiceProviders = TestUtils.renderIntoDocument(
      <AnalysisServiceProviders
        fetching={false}
        stats={fakeStats}
        statsToday={fakeStatsToday}/>
    );
    const trs = TestUtils.scryRenderedDOMComponentsWithTag(analysisServiceProviders, 'tr')
    expect(trs.length).toBe(3);
  });
})
