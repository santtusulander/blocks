import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.dontMock('../accounts.jsx')
const Accounts = require('../accounts.jsx').Accounts

function accountActionsMaker() {
  return {
    startFetching: jest.genMockFunction(),
    fetchAccounts: jest.genMockFunction(),
    fetchAccount: jest.genMockFunction(),
    deactivateAccount: jest.genMockFunction()
  }
}

describe('Accounts', () => {
  it('should exist', () => {
    let accounts = TestUtils.renderIntoDocument(
      <Accounts accountActions={accountActionsMaker()} fetching={true}/>
    )
    expect(TestUtils.isCompositeComponent(accounts)).toBeTruthy()
  });

  it('should request data on mount', () => {
    const accountActions = accountActionsMaker()
    TestUtils.renderIntoDocument(
      <Accounts accountActions={accountActions} fetching={true}/>
    )
    expect(accountActions.startFetching.mock.calls.length).toBe(1)
    expect(accountActions.fetchAccounts.mock.calls[0][0]).toBe('udn')
  });

  it('should show a loading message', () => {
    let accounts = TestUtils.renderIntoDocument(
      <Accounts accountActions={accountActionsMaker()} fetching={true}/>
    )
    let tbody = TestUtils.findRenderedDOMComponentWithTag(accounts, 'tbody')
    expect(ReactDOM.findDOMNode(tbody).textContent).toContain('Loading...')
  });

  it('should show existing accounts', () => {
    let accounts = TestUtils.renderIntoDocument(
      <Accounts accountActions={accountActionsMaker()}
        accounts={Immutable.List([1,2])}/>
    )
    let tbody = TestUtils.findRenderedDOMComponentWithTag(accounts, 'tbody')
    expect(ReactDOM.findDOMNode(tbody).textContent).not.toContain('Loading...')
    let trs = TestUtils.scryRenderedDOMComponentsWithTag(accounts, 'tr')
    expect(trs.length).toBe(3)
    expect(ReactDOM.findDOMNode(trs[1]).textContent).toContain('1')
  });

  it('should activate an account for edit when clicked', () => {
    const accountActions = accountActionsMaker()
    let accounts = TestUtils.renderIntoDocument(
      <Accounts accountActions={accountActions}
        accounts={Immutable.List([1])}/>
    )
    let trs = TestUtils.scryRenderedDOMComponentsWithTag(accounts, 'tr')
    TestUtils.Simulate.click(trs[1])
    expect(accountActions.fetchAccount.mock.calls[0]).toEqual(['udn',1])
  });

  it('should deactivate an account when clicked if already active', () => {
    const accountActions = accountActionsMaker()
    let accounts = TestUtils.renderIntoDocument(
      <Accounts accountActions={accountActions}
        accounts={Immutable.List([1])}
        activeAccount={Immutable.Map({id:1})}/>
    )
    let trs = TestUtils.scryRenderedDOMComponentsWithTag(accounts, 'tr')
    TestUtils.Simulate.click(trs[1])
    expect(accountActions.deactivateAccount.mock.calls.length).toBe(1)
  });
})
