import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../accounts.jsx')
const Accounts = require('../accounts.jsx').Accounts

const accountActions = {
  startFetching: jest.genMockFunction(),
  fetchAccounts: jest.genMockFunction()
}

describe('Accounts', () => {
  it('should exist', () => {
    let accounts = TestUtils.renderIntoDocument(
      <Accounts accountActions={accountActions} fetching={true}/>
    );
    expect(TestUtils.isCompositeComponent(accounts)).toBeTruthy();
  });
})
