import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../service-type.jsx')
const ServiceType = require('../service-type.jsx')

describe('FilterServiceType', () => {
  it('should exist', () => {
    const filter = TestUtils.renderIntoDocument(
      <ServiceType toggleServiceType={jest.genMockFunction()}/>
    )
    expect(TestUtils.isCompositeComponent(filter)).toBeTruthy()
  })
})
