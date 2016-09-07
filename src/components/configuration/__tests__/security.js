import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { shallow } from 'enzyme'

// Mock out intl
jest.mock('react-intl')
const reactIntl = require('react-intl')
reactIntl.injectIntl = jest.fn(wrappedClass => wrappedClass)

jest.dontMock('../security.jsx')
const ConfigurationSecurity = require('../security.jsx')

describe('ConfigurationSecurity', () => {
  it('should exist', () => {
    const security = shallow(<ConfigurationSecurity />)
    expect(security).toBeDefined()
  });
})
