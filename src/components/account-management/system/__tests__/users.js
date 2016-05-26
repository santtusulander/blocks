import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../users.jsx')
const Users = require('../users.jsx')

describe('AccountManagementSystemUsers', () => {
  it('should exist', () => {
    const users = TestUtils.renderIntoDocument(
      <Users />
    )
    expect(TestUtils.isCompositeComponent(users)).toBeTruthy()
  })
})
