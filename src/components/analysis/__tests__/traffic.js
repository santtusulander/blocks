import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../traffic.jsx')
const AnalysisTraffic = require('../traffic.jsx')

// Set up mocks to make sure formatting libs are used correctly
const moment = require('moment')
const numeral = require('numeral')

const momentFormatMock = jest.genMockFunction()
const numeralFormatMock = jest.genMockFunction()

moment.mockReturnValue({format:momentFormatMock})
numeral.mockReturnValue({format:numeralFormatMock})

const fakeCountryData = Immutable.fromJS([
  {
    "country": "usa",
    "percent_total": 22,
    "traffic": [
      {
        "bytes": 34857,
        "timestamp": "2016-01-01 01:00:00"
      },
      {
        "bytes": 68745,
        "timestamp": "2016-01-01 02:00:00"
      }
    ]
  },
  {
    "country": "can",
    "percent_total": 10,
    "traffic": [
      {
        "bytes": 45767,
        "timestamp": "2016-01-01 01:00:00"
      },
      {
        "bytes": 34556,
        "timestamp": "2016-01-01 02:00:00"
      }
    ]
  },
  {
    "country": "mex",
    "percent_total": 3,
    "traffic": [
      {
        "bytes": 1111,
        "timestamp": "2016-01-01 01:00:00"
      },
      {
        "bytes": 1111,
        "timestamp": "2016-01-01 02:00:00"
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
        byCountry={Immutable.List()}/>
    );
    expect(TestUtils.isCompositeComponent(traffic)).toBeTruthy();
  });
})
