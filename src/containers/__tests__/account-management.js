import React from 'react'
import {shallow} from 'enzyme'

jest.unmock('../account-management.jsx')

import {AccountManagement} from '../account-management.jsx'

const fakeParams = {account: 1}

describe('AccountManagement', () => {
  it('should exist', () => {
    let accountManagement = shallow(
      <AccountManagement
        fetchAccountData={jest.genMockFunction()}
        params={fakeParams}
        dnsActions={ { changeRecordType: jest.genMockFunction() } }
      />
    );
    expect(accountManagement.length).toBe(1)
  });
})
