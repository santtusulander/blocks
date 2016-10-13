import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.dontMock('../security.jsx')
const ConfigurationSecurity = require('../security.jsx')

describe('ConfigurationSecurity', () => {
  it('should exist', () => {
    const security = shallow(
      <ConfigurationSecurity
        config={Immutable.Map()}
        sslCertificates={Immutable.List()}/>
    )
    expect(security).toBeDefined()
  });
})
