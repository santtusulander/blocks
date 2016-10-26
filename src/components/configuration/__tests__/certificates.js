import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../certificates.jsx')
import ConfigurationCertificates from '../certificates.jsx'

describe('ConfigurationCertificates', () => {
  it('should exist', () => {
    const certificates = shallow(<ConfigurationCertificates />)
    expect(certificates).toBeDefined()
  })
})
