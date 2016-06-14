import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../property.jsx')
const Property = require('../property.jsx')

describe('FilterProperty', () => {
  it('should exist', () => {
    const filter = TestUtils.renderIntoDocument(<Property/>)
    expect(TestUtils.isCompositeComponent(filter)).toBeTruthy()
  })
})
