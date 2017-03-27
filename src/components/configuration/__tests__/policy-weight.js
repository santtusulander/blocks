import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../policy-weight')
import PolicyWeight from '../policy-weight'

describe('PolicyWeight', () => {
  it('should exist', () => {
    const subject = shallow(<PolicyWeight secondaryProvider="CDN" />)
    expect(subject).toBeDefined()
  })
})
