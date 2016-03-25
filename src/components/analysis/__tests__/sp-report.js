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

const fakeCountryData = Immutable.fromJS([
  {
    code:"USA",
    name:"United States",
    percent_change:null,
    percent_total:0.9995,
    historical_total:0,
    total:40372232,
    detail:[
      {
        bytes:60722,
        timestamp:1456819200
      },{
        bytes:60722,
        timestamp:1456822800
      }
    ]
  },{
    code:"UKR",
    name:"Ukraine",
    percent_change:null,
    percent_total:0.0005,
    historical_total:0,
    total:19561,
    detail:[
      {
        bytes:3807,
        timestamp:1456819200
      },{
        bytes:60722,
        timestamp:1456822800
      }
    ]
  }
])

describe('AnalysisSPReport', () => {
  it('should exist', () => {
    let analysisSPReport = TestUtils.renderIntoDocument(
      <AnalysisSPReport
        fetching={true}
        byTime={Immutable.List()}
        byCountry={Immutable.List()}
        serviceTypes={Immutable.List()}/>
    );
    expect(TestUtils.isCompositeComponent(analysisSPReport)).toBeTruthy();
  });

  it('should show data rows in table', () => {
    let analysisSPReport = TestUtils.renderIntoDocument(
      <AnalysisSPReport
        fetching={true}
        byTime={Immutable.List()}
        byCountry={fakeCountryData}
        serviceTypes={Immutable.List()}/>
    );
    let tds = TestUtils.scryRenderedDOMComponentsWithTag(analysisSPReport, 'td')
    expect(tds.length).toBe(12);
  });
})
