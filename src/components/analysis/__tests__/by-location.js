import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.dontMock('../by-location.jsx')
const AnalysisByLocation = require('../by-location.jsx').AnalysisByLocation

// Set up mocks to make sure formatting libs are used correctly
const moment = require('moment')
const numeral = require('numeral')

const momentFormatMock = jest.genMockFunction()
const numeralFormatMock = jest.genMockFunction()

moment.mockReturnValue({format:momentFormatMock})
numeral.mockReturnValue({format:numeralFormatMock})

let topojson = require('topojson')
topojson.feature = topojson.feature.mockImplementation(function(topo) {
  let features = []
  if(topo.objects.countries) {
    features = topo.objects.countries
  }
  else if(topo.objects.states) {
    features = topo.objects.states
  }
  else if(topo.objects.cities) {
    features = topo.objects.cities
  }
  return {features: features}
});

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
//
// const fakeStates = Immutable.fromJS({
//   objects: {
//     states: [
//       {properties: {name: 'Georgia'}},
//       {properties: {name: 'Michigan'}},
//       {properties: {name: 'California'}},
//       {properties: {name: 'Nevada'}}
//     ]
//   }
// })
//
// const fakeStateData = Immutable.fromJS([
//   {id: 'Georgia', trending: -1},
//   {id: 'Michigan', trending: 1},
//   {id: 'California', trending: 0}
// ])
//
// const fakeCities = Immutable.fromJS({
//   objects: {
//     cities: [
//       {properties: {name: 'Savannah', state: 'Georgia'}},
//       {properties: {name: 'Atlanta', state: 'Georgia'}},
//       {properties: {name: 'Augusta', state: 'Georgia'}}
//     ]
//   }
// })
//
// const fakeCityData = Immutable.fromJS([
//   {name: 'Savannah', state: 'Georgia', trending: -1},
//   {name: 'Atlanta', state: 'Georgia', trending: 1},
//   {name: 'Augusta', state: 'Georgia', trending: 0}
// ])

describe('AnalysisByLocation', () => {
  it('should exist', () => {
    let byLocation = TestUtils.renderIntoDocument(
      <AnalysisByLocation topoActions={topoActionsMaker()} />
    );
    expect(TestUtils.isCompositeComponent(byLocation)).toBeTruthy();
  });

  it('should request countries on mount', () => {
    const topoActions = topoActionsMaker()
    TestUtils.renderIntoDocument(
      <AnalysisByLocation topoActions={topoActions}/>
    )
    expect(topoActions.startFetching.mock.calls.length).toBe(1)
    expect(topoActions.fetchCountries.mock.calls.length).toBe(1)
  });

  it('should show loading message if there is no width or data', () => {
    let byLocation = TestUtils.renderIntoDocument(
      <AnalysisByLocation topoActions={topoActionsMaker()}/>
    );
    let div = TestUtils.findRenderedDOMComponentWithTag(byLocation, 'div')
    expect(div.textContent).toContain('Loading');
  });

  it('should show countries', () => {
    let byLocation = TestUtils.renderIntoDocument(
      <AnalysisByLocation topoActions={topoActionsMaker()}
        fetching={false} width={400} height={200}
        countries={fakeCountries}
        countryData={fakeCountryData}
        dataKey="bytes"
        timelineKey="detail"/>
    );
    let paths = TestUtils.scryRenderedDOMComponentsWithTag(byLocation, 'path')
    expect(paths.length).toBe(3)
    expect(paths[0].getAttribute('class')).toContain('above-avg')
    expect(paths[1].getAttribute('class')).toContain('below-avg')
    expect(paths[2].getAttribute('class')).toContain('avg')
  });
  // Not supporting zoom in 0.5
  // it('should show states', () => {
  //   let byLocation = TestUtils.renderIntoDocument(
  //     <AnalysisByLocation topoActions={topoActionsMaker()}
  //       fetching={false} width={400} height={200}
  //       countries={fakeCountries}
  //       countryData={fakeCountryData}
  //       activeCountry='usa'
  //       states={fakeStates}
  //       stateData={fakeStateData}/>
  //   );
  //   let paths = TestUtils.scryRenderedDOMComponentsWithTag(byLocation, 'path')
  //   expect(paths.length).toBe(7)
  //   expect(paths[3].getAttribute('class')).toContain('below-avg')
  //   expect(paths[4].getAttribute('class')).toContain('above-avg')
  //   expect(paths[5].getAttribute('class')).toContain('avg')
  // });

  // it('should show cities', () => {
  //   let byLocation = TestUtils.renderIntoDocument(
  //     <AnalysisByLocation topoActions={topoActionsMaker()}
  //       fetching={false} width={400} height={200}
  //       countries={fakeCountries}
  //       countryData={fakeCountryData}
  //       activeCountry='usa'
  //       states={fakeStates}
  //       stateData={fakeStateData}
  //       activeState='Georgia'
  //       cities={fakeCities}
  //       cityData={fakeCityData}/>
  //   );
  //   let paths = TestUtils.scryRenderedDOMComponentsWithTag(byLocation, 'path')
  //   expect(paths.length).toBe(10)
  //   expect(paths[7].getAttribute('class')).toContain('below-avg')
  //   expect(paths[8].getAttribute('class')).toContain('above-avg')
  //   expect(paths[9].getAttribute('class')).toContain('avg')
  // });
  //
  // it('selects a country when clicked', () => {
  //   const topoActions = topoActionsMaker()
  //   let byLocation = TestUtils.renderIntoDocument(
  //     <AnalysisByLocation topoActions={topoActions}
  //       fetching={false} width={400} height={200}
  //       countries={fakeCountries}
  //       countryData={fakeCountryData}/>
  //   );
  //   let paths = TestUtils.scryRenderedDOMComponentsWithTag(byLocation, 'path')
  //   TestUtils.Simulate.click(paths[0])
  //   expect(topoActions.changeActiveCountry.mock.calls[0][0]).toBe('usa')
  //   expect(topoActions.fetchStates.mock.calls[0][0]).toBe('usa')
  // });
  //
  // it('selects a state when clicked', () => {
  //   const topoActions = topoActionsMaker()
  //   let byLocation = TestUtils.renderIntoDocument(
  //     <AnalysisByLocation topoActions={topoActions}
  //       fetching={false} width={400} height={200}
  //       countries={fakeCountries}
  //       countryData={fakeCountryData}
  //       activeCountry='usa'
  //       states={fakeStates}
  //       stateData={fakeStateData}/>
  //   );
  //   let paths = TestUtils.scryRenderedDOMComponentsWithTag(byLocation, 'path')
  //   TestUtils.Simulate.click(paths[3])
  //   expect(topoActions.changeActiveState.mock.calls[0][0]).toBe('Georgia')
  //   expect(topoActions.fetchCities.mock.calls[0][0]).toBe('usa')
  // });
  //
  // it('zooms out from a country when the zoom out is clicked', () => {
  //   const topoActions = topoActionsMaker()
  //   let byLocation = TestUtils.renderIntoDocument(
  //     <AnalysisByLocation topoActions={topoActions}
  //       fetching={false} width={400} height={200}
  //       countries={fakeCountries}
  //       countryData={fakeCountryData}
  //       activeCountry='usa'
  //       states={fakeStates}
  //       stateData={fakeStateData}/>
  //   );
  //   let zoom = TestUtils.scryRenderedDOMComponentsWithTag(byLocation, 'a')
  //   TestUtils.Simulate.click(zoom[0])
  //   expect(topoActions.changeActiveCountry.mock.calls[0][0]).toBe(null)
  // });
  //
  // it('zooms out from a state when the zoom out is clicked', () => {
  //   const topoActions = topoActionsMaker()
  //   let byLocation = TestUtils.renderIntoDocument(
  //     <AnalysisByLocation topoActions={topoActions}
  //       fetching={false} width={400} height={200}
  //       countries={fakeCountries}
  //       countryData={fakeCountryData}
  //       activeCountry='usa'
  //       states={fakeStates}
  //       stateData={fakeStateData}
  //       activeState='Georgia'
  //       cities={fakeCities}
  //       cityData={fakeCityData}/>
  //   );
  //   let zoom = TestUtils.scryRenderedDOMComponentsWithTag(byLocation, 'a')
  //   TestUtils.Simulate.click(zoom[0])
  //   expect(topoActions.changeActiveState.mock.calls[0][0]).toBe(null)
  // });
})
