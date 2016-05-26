import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../roles.jsx')
const Roles = require('../roles.jsx')

describe('AccountManagementSystemRoles', () => {
  it('should exist', () => {
    const roles = TestUtils.renderIntoDocument(
      <Roles />
    )
    expect(TestUtils.isCompositeComponent(roles)).toBeTruthy()
  })
})
