import React from 'react'
import {shallow} from 'enzyme'

jest.unmock('../dns.jsx');
import DNS from '../dns.jsx'

describe('AccountManagementSystemDNS', () => {
  it('should exist', () => {
    const dns = shallow(
      <DNS/>
    )
    expect(dns.length).toBe(1)
  })
})
