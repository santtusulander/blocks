import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { shallow } from 'enzyme'

jest.dontMock('../certificates.jsx')
const ConfigurationCertificates = require('../certificates.jsx')

describe('ConfigurationCertificates', () => {
  it('should exist', () => {
    const certificates = shallow(<ConfigurationCertificates />)
    expect(certificates).toBeDefined()
  })
})
