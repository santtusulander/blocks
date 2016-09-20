import React from 'react'
import {shallow} from 'enzyme'

jest.unmock('../dns.jsx');
import DNS from '../dns.jsx'

jest.unmock('../../../__mocks__/gen-async');
import { genAsyncMock } from '../../../__mocks__/gen-async'

const fakeDomains = [];
const fakeRecords = [];

describe('AccountManagementSystemDNS', () => {
  it('should exist', () => {
    const dns = shallow(
      <DNS params={{}} fetchDomains={ genAsyncMock } domains={ fakeDomains } records={ fakeRecords }/>
    )
    expect(dns.length).toBe(1)
  })
})


