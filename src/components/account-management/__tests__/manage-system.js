import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../manage-system.jsx')
const ManageSystem = require('../manage-system.jsx')

describe('ManageSystem', () => {
  it('should exist', () => {
    const manageSystem = TestUtils.renderIntoDocument(
      <ManageSystem />
    )
    expect(TestUtils.isCompositeComponent(manageSystem)).toBeTruthy()
  })
})
