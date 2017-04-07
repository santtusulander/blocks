import React from 'react'
import {shallow} from 'enzyme'

jest.unmock('../../../util/status-codes')
jest.unmock('../account-management.jsx')

import {AccountManagement} from '../account-management.jsx'

const fakeParams = {account: 1}

function accountActionsMaker() {
  return {
    fetchAccount: jest.fn()
  }
}

function permissionsActionsMaker() {
  return {
    fetchPermissions: jest.fn()
  }
}

function rolesActionsMaker() {
  return {
    fetchRoles: jest.fn()
  }
}

function userActionsMaker() {
  return {
    fetchUsers: jest.fn(),
    fetchUsersForMultipleAccounts: jest.fn()
  }
}

function fakeRouterMaker() {
  return {
    isActive: jest.fn()
  }
}

describe('AccountManagement', () => {
  it('should exist', () => {
    let accountManagement = shallow(
      <AccountManagement
        accountActions={accountActionsMaker()}
        permissionsActions={permissionsActionsMaker()}
        rolesActions={rolesActionsMaker()}
        userActions={userActionsMaker()}
        fetchActiveAccount={jest.fn()}
        router={fakeRouterMaker()}
        params={fakeParams}
        dnsActions={ { changeRecordType: jest.fn() } }
      >
        <div route={{path: 'foo'}}></div>
      </AccountManagement>
    );
    expect(accountManagement.length).toBe(1)
  });
})
