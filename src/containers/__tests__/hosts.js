import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'
import {shallow,mount} from 'enzyme'
import jsdom from 'jsdom'

jest.autoMockOff()
jest.dontMock('../hosts.jsx')
const Hosts = require('../hosts.jsx').Hosts
const ContentItemChart = require('../../components/content-item-chart.jsx')
const ContentItemList = require('../../components/content-item-list.jsx')

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.window = document.defaultView


function hostActionsMaker() {
  return {
    startFetching: jest.genMockFunction(),
    fetchHosts: jest.genMockFunction(),
    createHost: jest.genMockFunction(),
    deleteHost: jest.genMockFunction()
  }
}
function uiActionsMaker() {
  return {
    toggleChartView: jest.genMockFunction()
  }
}

const urlParams = {brand: 'udn', account: '1', group: '1'}

const fakeMetrics = Immutable.fromJS([
  {
    avg_cache_hit_rate: 1,
    historical_traffic: [],
    historical_variance: [],
    traffic: [],
    transfer_rates: {
      peak: '3 Unit',
      average: '2 Unit',
      lowest: '1 Unit'
    }
  },
  {
    avg_cache_hit_rate: 2,
    historical_traffic: [],
    historical_variance: [],
    traffic: [],
    transfer_rates: {
      peak: '6 Unit',
      average: '5 Unit',
      lowest: '4 Unit'
    }
  }
])

describe('Hosts', () => {
  it('should exist', () => {
    let hosts = TestUtils.renderIntoDocument(
      <Hosts hostActions={hostActionsMaker()} uiActions={uiActionsMaker()}
        fetchData={jest.genMockFunction()}
        fetching={true}
        fetchingMetrics={true}
        params={urlParams}/>
    )
    expect(TestUtils.isCompositeComponent(hosts)).toBeTruthy()
  });

  it('should request data on mount', () => {
    const fetchData = jest.genMockFunction()
    TestUtils.renderIntoDocument(
      <Hosts hostActions={hostActionsMaker()} uiActions={uiActionsMaker()}
        fetchData={fetchData}
        fetching={true}
        fetchingMetrics={true}
        params={urlParams}/>
    )
    expect(fetchData.mock.calls.length).toBe(1)
  });

  it('should show a loading message', () => {
    let hosts = mount(
      <Hosts hostActions={hostActionsMaker()} uiActions={uiActionsMaker()}
        fetchData={jest.genMockFunction()}
        fetching={true}
        fetchingMetrics={true}
        params={urlParams}/>
    )

    expect(hosts.find('LoadingSpinner').length).toBe(1)

  });

  it('should show existing hosts as charts', () => {
    let hosts = TestUtils.renderIntoDocument(
      <Hosts hostActions={hostActionsMaker()}
        uiActions={uiActionsMaker()}
        fetchData={jest.genMockFunction()}
        hosts={Immutable.List(['1','2'])}
        metrics={fakeMetrics}
        params={urlParams}
        viewingChart={true}/>
    )
    let child = TestUtils.scryRenderedComponentsWithType(hosts, ContentItemChart)
    expect(child.length).toBe(2)
    expect(child[0].props.id).toBe('1')
  });

  it('should show existing hosts as lists', () => {
    let hosts = TestUtils.renderIntoDocument(
      <Hosts hostActions={hostActionsMaker()} uiActions={uiActionsMaker()}
        fetchData={jest.genMockFunction()}
        hosts={Immutable.List(['1','2'])}
        metrics={fakeMetrics}
        params={urlParams}
        viewingChart={false}/>
    )
    let child = TestUtils.scryRenderedComponentsWithType(hosts, ContentItemList)
    expect(child.length).toBe(2)
    expect(child[0].props.id).toBe('1')
  });

  it('should add a new host when called', () => {
    const hostActions = hostActionsMaker()
    let hosts = TestUtils.renderIntoDocument(
      <Hosts hostActions={hostActions} uiActions={uiActionsMaker()}
        fetchData={jest.genMockFunction()}
        hosts={Immutable.List()}
        params={urlParams}/>
    )
    hosts.createNewHost('bbb','production')
    expect(hostActions.createHost.mock.calls[0]).toEqual(['udn','1','1','bbb','production'])
  })

  it('should delete a host when clicked', () => {
    const hostActions = hostActionsMaker()
    let hosts = TestUtils.renderIntoDocument(
      <Hosts hostActions={hostActions} uiActions={uiActionsMaker()}
        fetchData={jest.genMockFunction()}
        hosts={Immutable.List()}
        params={urlParams}/>
    )
    hosts.deleteHost('aaa')
    expect(hostActions.deleteHost.mock.calls[0]).toEqual(['udn','1','1','aaa'])
  })
})
