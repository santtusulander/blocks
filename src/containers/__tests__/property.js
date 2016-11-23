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

jest.unmock('../property/property.jsx')
import Property from '../property/property.jsx'

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
    resetActivePurge: jest.fn(),
    updateActivePurge: jest.fn()
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
    fetchByTime: jest.fn(() => Promise.resolve()),
    finishFetching: jest.fn(),
    visitorsReset: jest.fn()
  }
}

const urlParams = {brand: 'udn', account: '1', group: '2', property: 'www.abc.com', version: '1'}

const fakeLocation = {query: {name: 'www.abc.com'}}

describe('Property', () => {

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
        purgeActions: purgeActionsMaker(),
        trafficActions: trafficActionsMaker(),
        visitorsActions: visitorsActionsMaker(),
        uiActions: uiActionsMaker(),
        routes: [
          'foo',
          'bar'
        ]
      }
      return shallow(<Property {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1);
  });

  it('should toggle property menu', () => {
    const instance = subject().instance()
    expect(instance.state.propertyMenuOpen).toBe(false)
    instance.togglePropertyMenu()
    expect(instance.state.propertyMenuOpen).toBe(true)
  });

  it('should show a notification', () => {
    const instance = subject().instance()
    const uiActions = instance.props.uiActions
    instance.showNotification('aaa')
    expect(uiActions.changeNotification.mock.calls[0][0]).toBe('aaa')
  })

  it('should toggle purge form', () => {
    const instance = subject().instance()
    const purgeActions = instance.props.purgeActions
    expect(instance.state.purgeActive).toBe(false)
    instance.togglePurge()
    expect(instance.state.purgeActive).toBe(true)
    expect(purgeActions.resetActivePurge.mock.calls.length).toBe(1)
  });
})
