import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../visitors.jsx')
jest.unmock('../../table-sorter.jsx')

import AnalysisVisitors from '../visitors.jsx'

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

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('AnalysisVisitors', () => {
  it('should exist', () => {
    const visitors = shallow(
      <AnalysisVisitors fetching={true}
        serviceTypes={Immutable.List()}
        intl={intlMaker()}/>
    );
    expect(visitors).toBeTruthy();
  });

  it('should show there is no data message if there is no data', () => {
    const visitors = shallow(
      <AnalysisVisitors fetching={true}
        serviceTypes={Immutable.List()}
        intl={intlMaker()}/>
    );
    expect(visitors.find({ id: 'portal.common.no-data.text' }).length).toBe(3);
  });

  it('should show data in tables', () => {
    const visitors = shallow(
      <AnalysisVisitors
        fetching={false}
        serviceTypes={Immutable.List()}
        byBrowser={fakeBrowserData}
        byCountry={fakeCountryData}
        byOS={fakeOSData}
        byTime={fakeByTimeData}
        intl={intlMaker()}/>
    );
    const tds = visitors.find('td')
    expect(tds.length).toBe(24);
  });
})
