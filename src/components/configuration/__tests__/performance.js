import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { shallow } from 'enzyme'

// Mock out intl
jest.mock('react-intl')
const reactIntl = require('react-intl')
reactIntl.injectIntl = jest.fn(wrappedClass => wrappedClass)

jest.dontMock('../performance.jsx')
const ConfigurationPerformance = require('../performance.jsx')

describe('ConfigurationPerformance', () => {
  it('should exist', () => {
    const performance = shallow(<ConfigurationPerformance />)
    expect(performance).toBeDefined()
  })
})
