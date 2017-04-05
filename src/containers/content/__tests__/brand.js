import React from 'react'
import Immutable from 'immutable'
import {shallow} from 'enzyme'

jest.mock('../../../util/helpers', () => {
  return {
    getAnalyticsUrl: jest.fn(),
    getContentUrl: jest.fn(),
    removeProps: jest.fn(),
    filterAccountsByUserName: jest.fn(),
    filterMetricsByAccounts: jest.fn(),
    matchesRegexp: jest.fn(),
    userIsServiceProvider: jest.fn(),
    userIsCloudProvider: jest.fn()
  }
})

jest.unmock('../brand.jsx')
jest.unmock('../../../util/status-codes')

import Brand from '../brand.jsx'

function accountActionsMaker() {
  return {
    startFetching: jest.fn(),
    fetchAccounts: jest.fn(),
    fetchAccount: jest.fn(),
    changeActiveAccount: jest.fn(),
    updateAccount: jest.fn(),
    createAccount: jest.fn(),
    deleteAccount: jest.fn()
  }
}

function uiActionsMaker() {
  return {
    toggleChartView: jest.fn()
  }
}

function metricsActionsMaker() {
  return {
    startAccountFetching: jest.fn(),
    fetchAccountMetrics: jest.fn()
  }
}

const fakeAccounts = Immutable.fromJS([
  {id: 1, name: 'aaa'}
])

const fakeMetrics = Immutable.fromJS([
  {
    "avg_cache_hit_rate": 94,
    "avg_ttfb": "13 ms",
    "transfer_rates": {
      "peak": "1.94 Mbps",
      "average": "126.96 Kbps",
      "lowest": "27.51 Kbps"
    },
    "historical_variance": [
      {
        "bytes": 50552191,
        "timestamp": 1461607200
      },
      {
        "bytes": 28499240,
        "timestamp": 1460552400
      }
    ],
    "historical_traffic": [
      {
        "bytes": null,
        "timestamp": 1458136800
      },
      {
        "bytes": null,
        "timestamp": 1458133200
      }
    ],
    "account": 1
  }
])

const urlParams = {brand: 'udn'}

describe('Brand', () => {
  it('should exist', () => {
    const fetchData=jest.fn()
    let accounts = shallow(
      <Brand
        accountActions={accountActionsMaker()}
        uiActions={uiActionsMaker()}
        metricsActions={metricsActionsMaker()}
        accounts={fakeAccounts}
        fetching={true}
        fetchData={fetchData}
        fetchingMetrics={true}
        params={urlParams}/>
    )
    expect(accounts).toBeDefined()
  });

  it('should request data on mount', () => {
    const accountActions = accountActionsMaker()
    const fetchData=jest.fn()
    shallow(
      <Brand
        accountActions={accountActions}
        uiActions={uiActionsMaker()}
        metricsActions={metricsActionsMaker()}
        fetchData={fetchData}
        fetching={true}
        fetchingMetrics={true}
        username="test"
        params={urlParams}/>
    )
    expect(fetchData.mock.calls.length).toBe(1)
  });

  it('should render contentItems component', () => {
    const accounts = shallow(
      <Brand
        accountActions={accountActionsMaker()}
        uiActions={uiActionsMaker()}
        metricsActions={metricsActionsMaker()}
        fetchData={jest.fn()}
        accounts={fakeAccounts}
        params={urlParams}
        metrics={fakeMetrics}
        username="test"/>
    )
    expect(accounts.find('ContentItems').length).toBe(1)
  });

  it('should delete an account when clicked', () => {
    const accountActions = accountActionsMaker()
    const removeAccount = jest.fn(() => Promise.resolve() )
    let accounts = shallow(
      <Brand
        accountActions={accountActions}
        uiActions={uiActionsMaker()}
        metricsActions={metricsActionsMaker()}
        fetchData={jest.fn()}
        accounts={fakeAccounts}
        params={urlParams}
        username="test"
        metrics={fakeMetrics}
        removeAccount={removeAccount}
      />
    )
    accounts.instance().deleteAccount('1')
    expect(removeAccount.mock.calls[0]).toEqual([{brand: 'udn', id: '1'}])
  })
})
