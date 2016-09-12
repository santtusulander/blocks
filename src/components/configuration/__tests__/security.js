import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { shallow } from 'enzyme'

jest.dontMock('../security.jsx')
const ConfigurationSecurity = require('../security.jsx')

describe('ConfigurationSecurity', () => {
  it('should exist', () => {
    const security = shallow(<ConfigurationSecurity />)
    expect(security).toBeDefined()
  });
})
