import React from 'react'
import {shallow} from 'enzyme'

jest.unmock('../dns.jsx');
import DNS from '../dns.jsx'

const fetchDomainsMock = () => {
  return new Promise((resolve, reject) => {
    process.nextTick(
      () => resolve(
        []
      )
    )
  })
}

const fakeDomains = [];
const fakeRecords = [];

describe('AccountManagementSystemDNS', () => {
  it('should exist jee', () => {
    const dns = shallow(
      <DNS params={{}} fetchDomains={ fetchDomainsMock } domains={ fakeDomains } records={ fakeRecords }/>
    )
    expect(dns.length).toBe(1)
  })
})


