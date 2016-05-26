import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../groups.jsx')
const Groups = require('../groups.jsx')

describe('AccountManagementAccountGroups', () => {
  it('should exist', () => {
    const groups = TestUtils.renderIntoDocument(
      <Groups />
    )
    expect(TestUtils.isCompositeComponent(groups)).toBeTruthy()
  })
})
