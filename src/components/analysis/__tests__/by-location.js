import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'
import { shallow } from 'enzyme'
import { FormattedMessage } from 'react-intl'

jest.unmock('../by-location.jsx')
import AnalysisByLocation from '../by-location.jsx'

function topoActionsMaker() {
  return {
    startFetching: jest.genMockFunction(),
    fetchCountries: jest.genMockFunction(),
    fetchStates: jest.genMockFunction().mockImplementation(() => {
      return {then: cb => cb({error:false})}
    }),
    fetchCities: jest.genMockFunction().mockImplementation(() => {
      return {then: cb => cb({error:false})}
    }),
    changeActiveCountry: jest.genMockFunction(),
    changeActiveState: jest.genMockFunction()
  }
}

const fakeCountries = Immutable.fromJS({
  objects: {
    countries: [
      {id: 'usa'},
      {id: 'can'},
      {id: 'mex'}
    ]
  }
})

const fakeCountryData = Immutable.fromJS([
  {
    "code": "usa",
    "percent_total": 22,
    "detail": [
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
    "code": "can",
    "percent_total": 10,
    "detail": [
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
    "code": "mex",
    "percent_total": 3,
    "detail": [
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

describe('AnalysisByLocation', () => {
  it('should exist', () => {
    let byLocation = shallow(
      <AnalysisByLocation
        countryData={fakeCountryData}
        cityData={Immutable.List()}
        markers={Immutable.List()}
      />
    )
    expect(byLocation).toBeDefined();
  })

  it('should show loading message if there is no data', () => {
    let byLocation = shallow(
      <AnalysisByLocation
        countryData={Immutable.List()}
        markers={Immutable.List()}
      />
    )
    expect(byLocation.contains(<FormattedMessage id="portal.common.no-data.text"/>))
  })

  it('should reflect all props and not fail', () => {
    let byLocation = shallow(
      <AnalysisByLocation
        countryData={Immutable.List()}
        theme="dark"
        height={400}
        dataKey="bits_per_second"
        dataKeyFormat={jest.fn()}
        mapBounds={{}}
        mapboxActions={{}}
        markers={Immutable.List()}
      />
    )
    expect(byLocation.contains(<FormattedMessage id="portal.common.no-data.text"/>))
  })
})
