import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'
import { shallow, mount } from 'enzyme'

jest.unmock('../no-content-items.jsx')
import NoContentItems from '../no-content-items'

describe('NoContentItems', () => {
  it('should exist', () => {
    const subject = shallow(<NoContentItems />)
    expect(subject.length).toBe(1)
  })
})
