import React from 'react'
import { shallow } from 'enzyme'

jest.mock('../../util/helpers', () => {
  return {
    formatBitsPerSecond: jest.fn(),
    getAnalyticsUrl: jest.fn(),
    removeProps: jest.fn(),
    matchesRegexp: jest.fn()
  }
})

jest.mock('../../util/routes', () => ({ getContentUrl: jest.fn() }))

jest.autoMockOff()

jest.unmock('../property/tabs/property-summary.jsx')
import PropertySummary from '../property/tabs/property-summary.jsx'

function accountActionsMaker() {
  return {
    fetchAccount: jest.fn()
  }
}

function groupActionsMaker() {
  return {
    fetchGroup: jest.fn()
  }
}

function hostActionsMaker() {
  return {
    startFetching: jest.fn(),
    fetchHost: jest.fn(),
    fetchHosts: jest.fn()
  }
}

function metricsActionsMaker() {
  return {
    fetchDailyHostTraffic: jest.fn(),
    fetchHostMetrics: jest.fn(),
    fetchHourlyHostTraffic: jest.fn()
  }
}

function purgeActionsMaker() {
  return {
    resetActivePurge: jest.fn()
  }
}

function trafficActionsMaker() {
  return {
    startFetching: jest.fn(),
    fetchByTime: jest.fn(),
    finishFetching: jest.fn()
  }
}

function uiActionsMaker() {
  return {
    changeNotification: jest.fn()
  }
}

function visitorsActionsMaker() {
  return {
    startFetching: jest.fn(),
    fetchByCountry: jest.fn(),
    finishFetching: jest.fn(),
    visitorsReset: jest.fn()
  }
}

const urlParams = {brand: 'udn', account: '1', group: '2', property: 'www.abc.com', version: '1'}

const fakeLocation = {query: {name: 'www.abc.com'}}

describe('PropertySummary', () => {

  let subject, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        params: urlParams,
        location: fakeLocation,
        fetching: true,
        accountActions: accountActionsMaker(),
        groupActions: groupActionsMaker(),
        hostActions: hostActionsMaker(),
        metricsActions: metricsActionsMaker(),
        trafficActions: trafficActionsMaker(),
        visitorsActions: visitorsActionsMaker(),
      }
      return shallow(<PropertySummary {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  });

  it('should request data on mount', () => {
    const hostActions = subject().instance().props.hostActions

    expect(hostActions.startFetching.mock.calls.length).toBe(1)
    expect(hostActions.fetchHost.mock.calls[0][0]).toBe('udn')
    expect(hostActions.fetchHost.mock.calls[0][1]).toBe('1')
    expect(hostActions.fetchHost.mock.calls[0][2]).toBe('2')
  });
})
