import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

// This component has a child that connects to redux, so mock that
const reactRedux = require('react-redux')
reactRedux.connect = jest.genMockFunction()
reactRedux.connect.mockImplementation(() => wrappedClass => wrappedClass)

jest.autoMockOff()
jest.dontMock('../visitors.jsx')

jest.dontMock('../../table-sorter.jsx')

const AnalysisVisitors = require('../visitors.jsx')

const fakeCountryData = Immutable.fromJS([
  {
    "code": "usa",
    "percent_total": 0.6,
    "detail": [
      {
        "uniq_vis": 34857,
        "timestamp": "2016-01-01 01:00:00"
      },
      {
        "uniq_vis": 68745,
        "timestamp": "2016-01-01 02:00:00"
      }
    ]
  },
  {
    "code": "can",
    "percent_total": 0.4,
    "detail": [
      {
        "uniq_vis": 45767,
        "timestamp": "2016-01-01 01:00:00"
      },
      {
        "uniq_vis": 34556,
        "timestamp": "2016-01-01 02:00:00"
      }
    ]
  }
])

const fakeBrowserData = Immutable.fromJS([
  {
    "name": "Chrome",
    "percent_total": 0.8,
    "detail": [
      {
        "uniq_vis": 987,
        "timestamp": "2016-01-01 01:00:00"
      },
      {
        "uniq_vis": 68745,
        "timestamp": "2016-01-01 02:00:00"
      }
    ]
  },
  {
    "name": "Safari",
    "percent_total": 0.2,
    "detail": [
      {
        "uniq_vis": 123,
        "timestamp": "2016-01-01 01:00:00"
      },
      {
        "uniq_vis": 34556,
        "timestamp": "2016-01-01 02:00:00"
      }
    ]
  }
])

const fakeOSData = Immutable.fromJS([
  {
    "name": "OS X",
    "percent_total": 0.6,
    "detail": [
      {
        "uniq_vis": 34857,
        "timestamp": "2016-01-01 01:00:00"
      },
      {
        "uniq_vis": 68745,
        "timestamp": "2016-01-01 02:00:00"
      }
    ]
  },
  {
    "name": "Windows",
    "percent_total": 0.4,
    "detail": [
      {
        "uniq_vis": 45767,
        "timestamp": "2016-01-01 01:00:00"
      },
      {
        "uniq_vis": 34556,
        "timestamp": "2016-01-01 02:00:00"
      }
    ]
  }
])

const fakeByTimeData = Immutable.fromJS([
  {
    "uniq_vis": 34857,
    "timestamp": new Date("2016-01-01 01:00:00")
  },
  {
    "uniq_vis": 68745,
    "timestamp": new Date("2016-01-01 02:00:00")
  }
])

describe('AnalysisVisitors', () => {
  it('should exist', () => {
    let visitors = TestUtils.renderIntoDocument(
      <AnalysisVisitors fetching={true}
        serviceTypes={Immutable.List()}/>
    );
    expect(TestUtils.isCompositeComponent(visitors)).toBeTruthy();
  });

  it('should show loading message if there is no data', () => {
    let visitors = TestUtils.renderIntoDocument(
      <AnalysisVisitors fetching={true}
        serviceTypes={Immutable.List()}/>
    );
    let div = TestUtils.scryRenderedDOMComponentsWithTag(visitors, 'div')
    expect(div[0].textContent).toContain('Loading...');
  });

  it('should show data in tables', () => {
    let visitors = TestUtils.renderIntoDocument(
      <AnalysisVisitors
        fetching={false}
        serviceTypes={Immutable.List()}
        byBrowser={fakeBrowserData}
        byCountry={fakeCountryData}
        byOS={fakeOSData}
        byTime={fakeByTimeData}/>
    );
    let tds = TestUtils.scryRenderedDOMComponentsWithTag(visitors, 'td')
    expect(tds.length).toBe(30);
  });
})
