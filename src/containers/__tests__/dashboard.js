import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'
import { FormattedMessage } from 'react-intl'

jest.unmock('../dashboard.jsx')
import Dashboard from '../dashboard.jsx'

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
    getAccountByID: val => val,
    separateUnit: val => ({ value: val }),
    buildFetchOpts: val => ({ dashboardOpts: val })
  }
})

function accountActionsMaker() {
  return {
    fetchAccounts: jest.fn()
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
  }
})

describe('Dashboard', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        accountActions: accountActionsMaker(),
        accounts: Immutable.fromJS([1]),
        dashboard: fakeDashboard,
        dashboardActions: dashboardActionsMaker(),
        filtersActions: filtersActionsMaker(),
        intl: intlMaker(),
        params: fakeParams,
        mapBounds: Immutable.fromJS({})
      }
      return shallow(<Dashboard {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1);
  })

  it('should show loading spinner', () => {
    const component = subject()
    component.setProps({ fetching: true })
    expect(component.find('LoadingSpinner').length).toBe(1)
  })

  it('should show no data text', () => {
    const component = subject()
    component.setProps({ dashboard: Immutable.Map() })
    expect(component.contains(<FormattedMessage id="portal.common.no-data.text"/>))
  })
});
