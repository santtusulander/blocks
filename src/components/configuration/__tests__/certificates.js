import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { shallow } from 'enzyme'

// Mock out intl
jest.mock('react-intl')
const reactIntl = require('react-intl')
reactIntl.injectIntl = jest.fn(wrappedClass => wrappedClass)

jest.dontMock('../certificates.jsx')
const ConfigurationCertificates = require('../certificates.jsx')

describe('ConfigurationCertificates', () => {
  it('should exist', () => {
    const certificates = shallow(<ConfigurationCertificates />)
    expect(certificates).toBeDefined()
  })
})
