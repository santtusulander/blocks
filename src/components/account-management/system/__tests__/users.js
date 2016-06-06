import React from 'react'
import {shallow} from 'enzyme'

jest.unmock('../users.jsx')

import Users from '../users.jsx'

describe('AccountManagementSystemUsers', () => {
  it('should exist', () => {
    const users = shallow(
      <Users />
    )

    expect(users.length).toBe(1)
  })
})
