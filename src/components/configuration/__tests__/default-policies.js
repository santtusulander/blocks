import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { shallow } from 'enzyme'

// Mock out intl
jest.mock('react-intl')
const reactIntl = require('react-intl')
reactIntl.injectIntl = jest.fn(wrappedClass => wrappedClass)

jest.dontMock('../default-policies.jsx')
const ConfigurationDefaultPolicies = require('../default-policies.jsx')

describe('ConfigurationDefaultPolicies', () => {
  it('should exist', () => {
    const defaultPolicies = shallow(<ConfigurationDefaultPolicies />)
    expect(defaultPolicies).toBeDefined()
  })
})
