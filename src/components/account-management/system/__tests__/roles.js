import React from 'react'
import {shallow} from 'enzyme'

jest.unmock('../roles.jsx')
import Roles from '../roles'

const accountActions = {
  startFetching: jest.fn(),
  fetchAccounts: jest.fn()
}

describe('AccountManagementSystemRoles', () => {
  it('should exist', () => {
    const roles = shallow(
      <Roles
        accountActions={accountActions}
        params={{}}
      />
    )
    expect(roles.length).toBe(1)
  })
})
