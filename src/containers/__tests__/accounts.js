import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'
import {shallow,mount} from 'enzyme'
import jsdom from 'jsdom'

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.window = document.defaultView

jest.autoMockOff()
jest.dontMock('../accounts.jsx')
const Accounts = require('../accounts.jsx').Accounts
const ContentItemChart = require('../../components/content-item-chart.jsx')
const ContentItemList = require('../../components/content-item-list.jsx')

function accountActionsMaker() {
  return {
    startFetching: jest.genMockFunction(),
    fetchAccounts: jest.genMockFunction(),
    fetchAccount: jest.genMockFunction(),
    changeActiveAccount: jest.genMockFunction(),
    updateAccount: jest.genMockFunction(),
    createAccount: jest.genMockFunction(),
    deleteAccount: jest.genMockFunction()
  }
}

function uiActionsMaker() {
  return {
    toggleChartView: jest.genMockFunction()
  }
}

function metricsActionsMaker() {
  return {
    startAccountFetching: jest.genMockFunction(),
    fetchAccountMetrics: jest.genMockFunction()
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
    const fetchData=jest.genMockFunction()
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
    const fetchData=jest.genMockFunction()
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

  it('should show a loading message', () => {
    let accounts = mount(
      <Accounts
        accountActions={accountActionsMaker()}
        uiActions={uiActionsMaker()}
        metricsActions={metricsActionsMaker()}
        fetchData={jest.genMockFunction()}
        fetching={true}
        fetchingMetrics={true}
        username="test"
        params={urlParams}/>
    )
    //let div = TestUtils.scryRenderedDOMComponentsWithTag(accounts, 'div')
    //expect(ReactDOM.findDOMNode(div[0]).textContent).toContain('Loading...')
    expect(accounts.find('LoadingSpinner').length).toBe(1)
  });

  it('should show existing accounts as charts', () => {
    let accounts = TestUtils.renderIntoDocument(
      <Accounts
        accountActions={accountActionsMaker()}
        uiActions={uiActionsMaker()}
        metricsActions={metricsActionsMaker()}
        fetchData={jest.genMockFunction()}
        accounts={fakeAccounts}
        params={urlParams}
        metrics={fakeMetrics}
        username="test"
        viewingChart={true}/>
    )
    let child = TestUtils.scryRenderedComponentsWithType(accounts, ContentItemChart)
    expect(child.length).toBe(1)
    expect(child[0].props.id).toBe('1')
  });

  it('should show existing accounts as lists', () => {
    let accounts = TestUtils.renderIntoDocument(
      <Accounts
        accountActions={accountActionsMaker()}
        uiActions={uiActionsMaker()}
        metricsActions={metricsActionsMaker()}
        fetchData={jest.genMockFunction()}
        accounts={fakeAccounts}
        params={urlParams}
        metrics={fakeMetrics}
        username="test"
        viewingChart={false}/>
    )
    let child = TestUtils.scryRenderedComponentsWithType(accounts, ContentItemList)
    expect(child.length).toBe(1)
    expect(child[0].props.id).toBe('1')
  });

  // it('should activate an account for edit when toggled', () => {
  //   const accountActions = accountActionsMaker()
  //   let accounts = TestUtils.renderIntoDocument(
  //     <Accounts
  //       accountActions={accountActions}
  //       uiActions={uiActionsMaker()}
  //       metricsActions={metricsActionsMaker()}
  //       accounts={fakeAccounts}
  //       params={urlParams}
  //       metrics={fakeMetrics}/>
  //   )
  //   accounts.toggleActiveAccount('1')()
  //   expect(accountActions.fetchAccount.mock.calls[0]).toEqual(['udn','1'])
  // });
  //
  // it('should deactivate an account when toggled if already active', () => {
  //   const accountActions = accountActionsMaker()
  //   let accounts = TestUtils.renderIntoDocument(
  //     <Accounts
  //       accountActions={accountActions}
  //       uiActions={uiActionsMaker()}
  //       metricsActions={metricsActionsMaker()}
  //       accounts={fakeAccounts}
  //       activeAccount={Immutable.Map({account_id:'1'})}
  //       params={urlParams}
  //       metrics={fakeMetrics}/>
  //   )
  //   accounts.toggleActiveAccount('1')()
  //   expect(accountActions.changeActiveAccount.mock.calls[0][0]).toBe(null)
  // });
  //
  // it('should be able to change the active account', () => {
  //   const accountActions = accountActionsMaker()
  //   let accounts = TestUtils.renderIntoDocument(
  //     <Accounts
  //       accountActions={accountActions}
  //       uiActions={uiActionsMaker()}
  //       metricsActions={metricsActionsMaker()}
  //       accounts={fakeAccounts}
  //       activeAccount={Immutable.Map({account_id: '1', name: 'aaa'})}
  //       params={urlParams}
  //       metrics={fakeMetrics}/>
  //   )
  //   accounts.changeActiveAccountValue(['name'], 'bbb')
  //   expect(accountActions.changeActiveAccount.mock.calls[0][0].toJS()).toEqual({
  //     account_id: '1',
  //     name: 'bbb'
  //   })
  // })
  //
  // it('should be able save updates to the active account', () => {
  //   const accountActions = accountActionsMaker()
  //   let accounts = TestUtils.renderIntoDocument(
  //     <Accounts
  //       accountActions={accountActions}
  //       uiActions={uiActionsMaker()}
  //       metricsActions={metricsActionsMaker()}
  //       accounts={fakeAccounts}
  //       activeAccount={Immutable.Map({account_id: '1', name: 'aaa'})}
  //       params={urlParams}
  //       metrics={fakeMetrics}/>
  //   )
  //   accounts.saveActiveAccountChanges()
  //   expect(accountActions.updateAccount.mock.calls[0][1]).toEqual({
  //     account_id: '1',
  //     name: 'aaa'
  //   })
  // })

  it('should delete an account when clicked', () => {
    const accountActions = accountActionsMaker()
    let accounts = TestUtils.renderIntoDocument(
      <Accounts
        accountActions={accountActions}
        uiActions={uiActionsMaker()}
        metricsActions={metricsActionsMaker()}
        fetchData={jest.genMockFunction()}
        accounts={fakeAccounts}
        params={urlParams}
        username="test"
        metrics={fakeMetrics}/>
    )
    accounts.deleteAccount('1')
    expect(accountActions.deleteAccount.mock.calls[0]).toEqual(['udn','1'])
  })
})
