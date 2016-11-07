import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../performance.jsx')
import ConfigurationPerformance from '../performance.jsx'

describe('ConfigurationPerformance', () => {
  it('should exist', () => {
    const performance = shallow(<ConfigurationPerformance />)
    expect(performance).toBeDefined()
  })
})
