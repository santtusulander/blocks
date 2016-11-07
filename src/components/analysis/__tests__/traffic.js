import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../traffic.jsx')
import AnalysisTraffic from '../traffic.jsx'

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

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('AnalysisTraffic', () => {
  it('should exist', () => {
    let traffic = shallow(
      <AnalysisTraffic
        fetching={true}
        byTime={Immutable.List()}
        byCountry={Immutable.List()}
        serviceTypes={Immutable.List()}
        dateRange='foo'
        intl={intlMaker()}/>
    );
    expect(traffic).toBeDefined();
  });

  it('should show data rows in table', () => {
    let traffic = shallow(
      <AnalysisTraffic
        fetching={false}
        byTime={Immutable.List()}
        byCountry={fakeCountryData}
        serviceTypes={Immutable.List()}
        dateRange='foo'
        intl={intlMaker()}/>
    );
    let tds = traffic.find('td')
    expect(tds.length).toBe(6);
  });
})
