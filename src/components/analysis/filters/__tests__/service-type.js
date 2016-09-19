import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'
import { shallow } from 'enzyme'

jest.unmock('../service-type.jsx')
import ServiceType from '../service-type'

const mockServiceTypes = Immutable.List(['foo', 'bar'])

describe('FilterServiceType', () => {
  it('should exist', () => {
    const wrapper = shallow(
      <ServiceType toggleServiceType={jest.genMockFunction()}/>
    )
    expect(TestUtils.isCompositeComponent(wrapper)).toBeTruthy()
  })

  it('should toggle service types', () => {
    const toggleServiceType = jest.genMockFunction()
    const wrapper = shallow(
      <ServiceType serviceTypes={mockServiceTypes}
        toggleServiceType={toggleServiceType}/>
    )
    wrapper.instance().toggleServiceType('zyx')()
    expect(toggleServiceType.mock.calls.length).toBe(1)
    expect(toggleServiceType.mock.calls[0][0]).toEqual('zyx')
  });
})
