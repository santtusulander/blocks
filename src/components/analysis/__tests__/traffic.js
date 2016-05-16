import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

// This component has a child that connects to redux, so mock that
const reactRedux = require('react-redux')
reactRedux.connect = jest.genMockFunction()
reactRedux.connect.mockImplementation(() => wrappedClass => wrappedClass)

jest.dontMock('../traffic.jsx')
jest.dontMock('../../table-sorter.jsx')

const AnalysisTraffic = require('../traffic.jsx')

// Set up mocks to make sure formatting libs are used correctly
const moment = require('moment')
const numeral = require('numeral')

const momentFormatMock = jest.genMockFunction()
const momentToDateMock = jest.genMockFunction()
const numeralFormatMock = jest.genMockFunction()

moment.mockReturnValue({format:momentFormatMock, toDate:momentToDateMock})
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
        timestamp:new Date("2016-01-01 00:00:00")
      },{
        bytes:60722,
        timestamp:new Date("2016-01-02 00:00:00")
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
        timestamp:new Date("2016-01-01 00:00:00")
      },{
        bytes:60722,
        timestamp:new Date("2016-01-02 00:00:00")
      }
    ]
  }
])

describe('AnalysisTraffic', () => {
  it('should exist', () => {
    let traffic = TestUtils.renderIntoDocument(
      <AnalysisTraffic
        fetching={true}
        byTime={Immutable.List()}
        byCountry={Immutable.List()}
        serviceTypes={Immutable.List()}
        dateRange='foo'/>
    );
    expect(TestUtils.isCompositeComponent(traffic)).toBeTruthy();
  });

  it('should show data rows in table', () => {
    let traffic = TestUtils.renderIntoDocument(
      <AnalysisTraffic
        fetching={false}
        byTime={Immutable.List()}
        byCountry={fakeCountryData}
        serviceTypes={Immutable.List()}
        dateRange='foo'/>
    );
    let tds = TestUtils.scryRenderedDOMComponentsWithTag(traffic, 'td')
    expect(tds.length).toBe(6);
  });
})
