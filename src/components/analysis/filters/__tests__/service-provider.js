import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../service-provider.jsx')
const ServiceProvider = require('../service-provider.jsx')

describe('FilterServiceProvider', () => {
  it('should exist', () => {
    const filter = TestUtils.renderIntoDocument(<ServiceProvider/>)
    expect(TestUtils.isCompositeComponent(filter)).toBeTruthy()
  })
})
