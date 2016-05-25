import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../account-management.jsx')
const {AccountManagement} = require('../account-management.jsx')

const fakeParams = {account: 1}

function accountActionsMaker() {
  return {
    fetchAccount: jest.genMockFunction()
  }
}

describe('AccountManagement', () => {
  it('should exist', () => {
    let accountManagement = TestUtils.renderIntoDocument(
      <AccountManagement
        accountActions={accountActionsMaker()}
        params={fakeParams}/>
    );
    expect(TestUtils.isCompositeComponent(accountManagement)).toBeTruthy();
  });
})
