import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'
import { FormattedMessage } from 'react-intl'

jest.unmock('../brand-dashboard.jsx')
jest.unmock('../../redux/modules/fetching/actions.js')
import BrandDashboard from '../brand-dashboard.jsx'

jest.mock('../../util/status-codes', () => {
  return {
    getAnalysisErrorCodes: () => [],
    getAnalysisStatusCodes: () => []
  }
})

jest.mock('../../util/helpers', () => {
  return {
    accountIsContentProviderType: val => val,
    formatBitsPerSecond: val => val,
    formatBytes: val => val,
    formatTime: val => val,
    separateUnit: val => ({ value: val }),
    buildFetchOpts: val => ({ dashboardOpts: val }),
    buildAnalyticsOptsForContribution: val => val
  }
})

function filterActionsMaker() {
  return {
    resetFilters: jest.fn(),
    fetchContentProvidersWithTrafficForSP: jest.fn(),
    fetchServiceProvidersWithTrafficForCP: jest.fn()
  }
}

function dashboardActionsMaker() {
  return {
    fetchDashboard: jest.fn(),
    finishFetching: jest.fn(),
    startFetching: jest.fn()
  }
}

function filtersActionsMaker() {
  return {
    setFilterValue: jest.fn()
  }
}

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

const fakeParams = { brand: 'foo', account: 'bar' }

const fakeDashboard = Immutable.fromJS({
  bandwidth: {
    detail: {
      foo: 'bar'
    }
  },
  cache_hit: {
    detail: {
      foo: 'bar'
    }
  },
  connections: {
    detail: {
      foo: 'bar'
    }
  },
  latency: {
    detail: {
      foo: 'bar'
    }
  },
  providers: [{
    bytes: 1,
    detail: {
      foo: 'bar'
    }
  }],
  traffic: {
    bytes: 1,
    detail: [{
      bytes_net_off: 1,
      timestamp: 2
    }]
  },
  countries: {
    bytes: 1,
    detail: [{
      bytes_net_off: 1,
      timestamp: 2
    }]
  },
  all_sp_providers: {
    bytes: 1,
    detail: [{
      bytes_net_off: 1,
      timestamp: 2
    }]
  }
})

describe('BrandDashboard', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        dashboard: fakeDashboard,
        dashboardActions: dashboardActionsMaker(),
        fetchAccount: () => Promise.resolve(),
        filterActions: filterActionsMaker(),
        filterOptions: Immutable.fromJS([{serviceProviders: 1}]),
        filtersActions: filtersActionsMaker(),
        intl: intlMaker(),
        params: fakeParams,
        mapBounds: Immutable.fromJS({})
      }
      return shallow(<BrandDashboard {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1);
  })

  it('should not show loading spinner', () => {
    const component = subject()
    component.setProps({ fetching: true })
    expect(component.find('LoadingSpinner').length).toBe(0)
  })

  it('should show no data text', () => {
    const component = subject()
    component.setProps({ dashboard: Immutable.Map() })
    expect(component.contains(<FormattedMessage id="portal.common.no-data.text"/>))
  })
});
