import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../details.jsx')
const Details = require('../details.jsx')

describe('AccountManagementAccountDetails', () => {
  it('should exist', () => {
    const details = TestUtils.renderIntoDocument(
      <Details />
    )
    expect(TestUtils.isCompositeComponent(details)).toBeTruthy()
  })
})
