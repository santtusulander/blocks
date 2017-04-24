import React from 'react'
import {shallow} from 'enzyme'

jest.unmock('../roles.jsx')
import Roles from '../roles'

const accountActions = {
  startFetching: jest.fn(),
  fetchAccounts: jest.fn()
}

const roleNamesActions = {
  fetchRoleNames: jest.fn()
}

describe('AccountManagementSystemRoles', () => {
  it('should exist', () => {
    const roles = shallow(
      <Roles
        fetchAccounts={accountActions.fetchAccounts}
        fetchRoleNames={roleNamesActions.fetchRoleNames}
        params={{}}
      />
    )
    expect(roles.length).toBe(1)
  })
})
