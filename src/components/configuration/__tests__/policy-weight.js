import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../policy-weight')
import PolicyWeight from '../policy-weight'

describe('PolicyWeight', () => {
  it('should exist', () => {
    const performance = shallow(<PolicyWeight secondaryProvider="CDN" />)
    expect(performance).toBeDefined()
  })
})
