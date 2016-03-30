import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../sp-report.jsx')
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

describe('AnalysisSPReport', () => {
  it('should exist', () => {
    let analysisSPReport = TestUtils.renderIntoDocument(
      <AnalysisSPReport
        fetching={true}
        serviceProviderStats={fakeServiceProviderStats}/>
    );
    expect(TestUtils.isCompositeComponent(analysisSPReport)).toBeTruthy();
  });

  it('should show data rows in table', () => {
    let analysisSPReport = TestUtils.renderIntoDocument(
      <AnalysisSPReport
        fetching={true}
        serviceProviderStats={fakeServiceProviderStats}/>
    );
    let trs = TestUtils.scryRenderedDOMComponentsWithTag(analysisSPReport, 'tr')
    expect(trs.length).toBe(3);
  });
})
