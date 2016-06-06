import React from 'react'
import {shallow} from 'enzyme'

jest.dontMock('../roles.jsx')
const Roles = require('../roles.jsx')

describe('AccountManagementSystemRoles', () => {
  it('should exist', () => {
    const roles = shallow(
      <Roles />
    )
    expect(roles.length).toBe(1)
  })
})
