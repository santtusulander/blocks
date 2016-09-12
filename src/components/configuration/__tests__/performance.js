import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { shallow } from 'enzyme'

jest.dontMock('../performance.jsx')
const ConfigurationPerformance = require('../performance.jsx')

describe('ConfigurationPerformance', () => {
  it('should exist', () => {
    const performance = shallow(<ConfigurationPerformance />)
    expect(performance).toBeDefined()
  })
})
