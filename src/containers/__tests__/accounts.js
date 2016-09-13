import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'
import {shallow,mount} from 'enzyme'
import jsdom from 'jsdom'

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.window = document.defaultView

jest.mock('../../util/helpers', () => {
  return {
    getAnalyticsUrl: jest.fn(),
    getContentUrl: jest.fn(),
    removeProps: jest.fn(),
    filterAccountsByUserName: jest.fn(),
    filterMetricsByAccounts: jest.fn()
  }
})

jest.dontMock('../accounts.jsx')
const Accounts = require('../accounts.jsx').Accounts

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

describe('Accounts', () => {
  it('should exist', () => {
    const fetchData=jest.fn()
    let accounts = TestUtils.renderIntoDocument(

      <Accounts
        accountActions={accountActionsMaker()}
        uiActions={uiActionsMaker()}
        metricsActions={metricsActionsMaker()}
        accounts={fakeAccounts}
        fetching={true}
        fetchData={fetchData}
        fetchingMetrics={true}
        params={urlParams}/>
    )
    expect(TestUtils.isCompositeComponent(accounts)).toBeTruthy()
  });

  it('should request data on mount', () => {
    const accountActions = accountActionsMaker()
    const fetchData=jest.fn()
    TestUtils.renderIntoDocument(
      <Accounts
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
      <Accounts
        accountActions={accountActionsMaker()}
        uiActions={uiActionsMaker()}
        metricsActions={metricsActionsMaker()}
        fetchData={jest.fn()}
        accounts={fakeAccounts}
        params={urlParams}
        metrics={fakeMetrics}
        username="test"/>
    )
    expect(accounts.find('.groups-container').length).toBe(1)
  });

  it('should delete an account when clicked', () => {
    const accountActions = accountActionsMaker()
    let accounts = TestUtils.renderIntoDocument(
      <Accounts
        accountActions={accountActions}
        uiActions={uiActionsMaker()}
        metricsActions={metricsActionsMaker()}
        fetchData={jest.fn()}
        accounts={fakeAccounts}
        params={urlParams}
        username="test"
        metrics={fakeMetrics}/>
    )
    accounts.deleteAccount('1')
    expect(accountActions.deleteAccount.mock.calls[0]).toEqual(['udn','1'])
  })
})
