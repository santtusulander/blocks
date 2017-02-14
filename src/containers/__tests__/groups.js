import React from 'react'
import ReactDOM from 'react-dom'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.mock('../../util/helpers', () => {
  return {
    getAnalyticsUrl: jest.fn(),
    getContentUrl: jest.fn(),
    removeProps: jest.fn(),
    accountIsServiceProviderType: jest.fn(),
    userIsServiceProvider: jest.fn(),
    matchesRegexp: jest.fn()
  }
})

jest.unmock('../../util/status-codes')
jest.unmock('../groups.jsx')

import { Groups } from '../groups.jsx'

function groupActionsMaker() {
  return {
    startFetching: jest.fn(),
    fetchGroups: jest.fn(),
    fetchGroup: jest.fn(),
    changeActiveGroup: jest.fn(),
    updateGroup: jest.fn(),
    createGroup: jest.fn(() => Promise.resolve()),
    deleteGroup: jest.fn(() => Promise.resolve())
  }
}
function uiActionsMaker() {
  return {
    toggleChartView: jest.fn()
  }
}
function accountActionsMaker() {
  return {
    fetchAccount: jest.fn()
  }
}
function metricsActionsMaker() {
  return {
    fetchGroupMetrics: jest.fn(),
    startGroupFetching: jest.fn()
  }
}

const fakeActiveAccount = Immutable.fromJS({
  id: '1'
})

const fakeGroups = Immutable.fromJS([
  {id: '1', name: 'aaa'},
  {id: '2', name: 'bbb'}
])

const fakeMetrics = Immutable.fromJS([
  {
    group: '1',
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
    group: '2',
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

const urlParams = {brand: 'udn', account: '1'}

describe('Groups', () => {
  let props = {}
  let subject = null
  const fetchUsers = () => Promise.resolve()
  const fetchData = () => Promise.resolve()
  const fetchMetricsData = jest.fn()
  const groupActions = groupActionsMaker()
  beforeEach(() => {
    subject = viewingChart => {
      props = {
        groupActions,
        activeAccount: fakeActiveAccount,
        uiActions: uiActionsMaker(),
        fetchUsers,
        fetchData,
        fetchMetricsData,
        fetching: true,
        fetchingMetrics: true,
        params: urlParams,
        groups: Immutable.List(['1','2']),
        metrics: fakeMetrics,
        viewingChart: viewingChart || false
      }
      return shallow(<Groups {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

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

  it('should add a new group when called', () => {
    subject().instance().createGroup({data: {name: 'bbb'}})
    expect(groupActions.createGroup.mock.calls[0]).toEqual(['udn','1',{name: 'bbb'}])
  })

  it('should delete a group when clicked', () => {
    subject().instance().deleteGroup(Immutable.fromJS({id: 'aaa'}))
    expect(groupActions.deleteGroup.mock.calls[0]).toEqual(['udn','1','aaa'])
  })
})
