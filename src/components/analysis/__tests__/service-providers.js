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

const fakeStats = Immutable.fromJS([
  {
    "name": "Vodafone",
    "http": {
      "net_on": 25000,
      "net_on_bps": 25000,
      "net_off": 50000,
      "net_off_bps": 50000
    },
    "https": {
      "net_on": 25000,
      "net_on_bps": 25000,
      "net_off": 50000,
      "net_off_bps": 50000
    },
    "countries": [
      {
        "name": "Germany",
        "code": "GER",
        "bytes": 150000,
        "bits_per_second": 150000,
        "percent_total": 0.35
      },
      {
        "name": "France",
        "code": "FRA",
        "bytes": 150000,
        "bits_per_second": 150000,
        "percent_total": 0.20
      }
    ]
  },
  {
    "name": "Telstra",
    "http": {
      "net_on": 50000,
      "net_on_bps": 50000,
      "net_off": 25000,
      "net_off_bps": 25000
    },
    "https": {
      "net_on": 25000,
      "net_on_bps": 25000,
      "net_off": 50000,
      "net_off_bps": 50000
    },
    "countries": [
      {
        "name": "Australia",
        "code": "AUS",
        "bytes": 150000,
        "bits_per_second": 150000,
        "percent_total": 0.30
      }
    ]
  }
])

describe('AnalysisServiceProviders', () => {
  it('should exist', () => {
    const analysisServiceProviders = TestUtils.renderIntoDocument(
      <AnalysisServiceProviders
        fetching={true}
        stats={fakeStats}/>
    );
    expect(TestUtils.isCompositeComponent(analysisServiceProviders)).toBeTruthy();
  });

  it('should show data rows in table', () => {
    const analysisServiceProviders = TestUtils.renderIntoDocument(
      <AnalysisServiceProviders
        fetching={false}
        stats={fakeStats}/>
    );
    const trs = TestUtils.scryRenderedDOMComponentsWithTag(analysisServiceProviders, 'tr')
    expect(trs.length).toBe(3);
  });
})
