import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../security.jsx')
import ConfigurationSecurity from '../security.jsx'

describe('ConfigurationSecurity', () => {
  it('should exist', () => {
    const security = shallow(
      <ConfigurationSecurity
        config={Immutable.Map()}
        sslCertificates={Immutable.Map()}/>
    )
    expect(security).toBeDefined()
  });
})
