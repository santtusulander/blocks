import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.mock('../../util/helpers', () => {
  return {
    getAnalyticsUrl: jest.fn(),
    getContentUrl: jest.fn(),
    removeProps: jest.fn()
  }
})

jest.unmock('../hosts.jsx')
import { Hosts } from '../hosts.jsx'

function hostActionsMaker() {
  return {
    startFetching: jest.fn(),
    fetchHosts: jest.fn(),
    createHost: jest.fn(),
    deleteHost: jest.fn()
  }
}
function uiActionsMaker() {
  return {
    toggleChartView: jest.fn()
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
  let props = {}
  let subject = null
  const fetchGroupData = () => Promise.resolve()
  const fetchMetricsData = jest.fn()
  const hostActions = hostActionsMaker()
  beforeEach(() => {
    subject = viewingChart => {
      props = {
        hostActions,
        uiActions: uiActionsMaker(),
        fetchGroupData,
        fetchMetricsData,
        fetching: true,
        fetchingMetrics: true,
        params: urlParams,
        hosts: Immutable.List(['1','2']),
        metrics: fakeMetrics,
        viewingChart: viewingChart || false
      }
      return shallow(<Hosts {...props}/>)
    }
  })
  it('should exist', () => {
    expect(subject().length).toBe(1)
  });

  it('should request data on mount', () => {
    // This will change if/when redux-thunk gets implemented
    // subject()
    // expect(fetchMetricsData.mock.calls.length).toBe(1)
  });

  it('should pass down loading flags', () => {
    const childProps = subject().find('ContentItems').props()
    expect(childProps.fetching).toBe(true)
    expect(childProps.fetchingMetrics).toBe(true)

  });

  it('should show existing hosts as charts', () => {
    expect(subject(true).find('ContentItems').props().viewingChart).toBe(true)
  });

  it('should show existing hosts as lists', () => {
    expect(subject().find('ContentItems').props().viewingChart).toBe(false)
  });

  it('should add a new host when called', () => {
    subject().instance().createNewHost('bbb','production')
    expect(hostActions.createHost.mock.calls[0]).toEqual(['udn','1','1','bbb','production'])
  })

  it('should delete a host when clicked', () => {
    subject().instance().deleteHost('aaa')
    expect(hostActions.deleteHost.mock.calls[0]).toEqual(['udn','1','1','aaa'])
  })
})
