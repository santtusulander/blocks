import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../brands.jsx')
const Brands = require('../brands.jsx')

describe('AccountManagementSystemBrands', () => {
  it('should exist', () => {
    const brands = TestUtils.renderIntoDocument(
      <Brands />
    )
    expect(TestUtils.isCompositeComponent(brands)).toBeTruthy()
  })
})
