import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.mock('../../util/helpers', () => {
  return {
    filterAccountsByUserName: jest.genMockFunction()
      .mockImplementation(accounts => accounts)
  }
})

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
  {id: '1', name: 'aaa'},
  {id: '2', name: 'bbb'}
])

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

const urlParams = {brand: 'udn'}

describe('Accounts', () => {
  it('should exist', () => {
    let accounts = TestUtils.renderIntoDocument(
      <Accounts
        accountActions={accountActionsMaker()}
        uiActions={uiActionsMaker()}
        metricsActions={metricsActionsMaker()}
        fetching={true}
        fetchingMetrics={true}
        params={urlParams}/>
    )
    expect(TestUtils.isCompositeComponent(accounts)).toBeTruthy()
  });

  it('should request data on mount', () => {
    const accountActions = accountActionsMaker()
    TestUtils.renderIntoDocument(
      <Accounts
        accountActions={accountActions}
        uiActions={uiActionsMaker()}
        metricsActions={metricsActionsMaker()}
        fetching={true}
        fetchingMetrics={true}
        params={urlParams}/>
    )
    expect(accountActions.startFetching.mock.calls.length).toBe(1)
    expect(accountActions.fetchAccounts.mock.calls[0][0]).toBe('udn')
  });

  it('should show a loading message', () => {
    let accounts = TestUtils.renderIntoDocument(
      <Accounts
        accountActions={accountActionsMaker()}
        uiActions={uiActionsMaker()}
        metricsActions={metricsActionsMaker()}
        fetching={true}
        fetchingMetrics={true}
        params={urlParams}/>
    )
    let div = TestUtils.scryRenderedDOMComponentsWithTag(accounts, 'div')
    expect(ReactDOM.findDOMNode(div[0]).textContent).toContain('Loading...')
  });

  it('should show existing accounts as charts', () => {
    let accounts = TestUtils.renderIntoDocument(
      <Accounts
        accountActions={accountActionsMaker()}
        uiActions={uiActionsMaker()}
        metricsActions={metricsActionsMaker()}
        accounts={fakeAccounts}
        params={urlParams}
        metrics={fakeMetrics}
        viewingChart={true}/>
    )
    let child = TestUtils.scryRenderedComponentsWithType(accounts, ContentItemChart)
    expect(child.length).toBe(2)
    expect(child[0].props.id).toBe('1')
  });

  it('should show existing accounts as lists', () => {
    let accounts = TestUtils.renderIntoDocument(
      <Accounts
        accountActions={accountActionsMaker()}
        uiActions={uiActionsMaker()}
        metricsActions={metricsActionsMaker()}
        accounts={fakeAccounts}
        params={urlParams}
        metrics={fakeMetrics}
        viewingChart={false}/>
    )
    let child = TestUtils.scryRenderedComponentsWithType(accounts, ContentItemList)
    expect(child.length).toBe(2)
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
        accounts={fakeAccounts}
        params={urlParams}
        metrics={fakeMetrics}/>
    )
    accounts.deleteAccount('1')
    expect(accountActions.deleteAccount.mock.calls[0]).toEqual(['udn','1'])
  })
})
