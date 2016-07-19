import React from 'react'
import {shallow} from 'enzyme'

jest.unmock('../account-management.jsx')

import {AccountManagement} from '../account-management.jsx'

const fakeParams = {account: 1}

function accountActionsMaker() {
  return {
    fetchAccount: jest.genMockFunction()
  }
}

describe('AccountManagement', () => {
  it('should exist', () => {
    let accountManagement = shallow(
      <AccountManagement
        accountActions={accountActionsMaker()}
        fetchAccountData={jest.genMockFunction()}
        params={fakeParams}
        dnsActions={ { changeRecordType: jest.genMockFunction() } }
      />
    );
    expect(accountManagement.length).toBe(1)
  });
})
