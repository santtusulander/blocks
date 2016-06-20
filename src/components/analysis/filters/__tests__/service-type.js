import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../service-type.jsx')
const ServiceType = require('../service-type.jsx')

const mockServiceTypes = Immutable.List(['foo', 'bar'])

describe('FilterServiceType', () => {
  it('should exist', () => {
    const filter = TestUtils.renderIntoDocument(
      <ServiceType toggleServiceType={jest.genMockFunction()}/>
    )
    expect(TestUtils.isCompositeComponent(filter)).toBeTruthy()
  })

  it('should toggle service types', () => {
    const toggleServiceType = jest.genMockFunction()
    let filter = TestUtils.renderIntoDocument(
      <ServiceType serviceTypes={mockServiceTypes}
        toggleServiceType={toggleServiceType}/>
    );
    filter.toggleServiceType('zyx')()
    expect(toggleServiceType.mock.calls.length).toBe(1)
    expect(toggleServiceType.mock.calls[0][0]).toEqual('zyx')
  });
})
