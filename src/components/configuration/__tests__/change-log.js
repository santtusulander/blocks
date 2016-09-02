import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { shallow } from 'enzyme'

// Mock out intl
jest.mock('react-intl')
const reactIntl = require('react-intl')
reactIntl.injectIntl = jest.fn(wrappedClass => wrappedClass)

jest.dontMock('../change-log.jsx')
const ConfigurationChangeLog = require('../change-log.jsx')

describe('ConfigurationChangeLog', () => {
  it('should exist', () => {
    const changeLog = shallow(<ConfigurationChangeLog />)
    expect(changeLog).toBeDefined()
  })
})
