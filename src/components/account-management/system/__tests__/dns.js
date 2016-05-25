import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../dns.jsx')
const DNS = require('../dns.jsx')

describe('AccountManagementSystemDNS', () => {
  it('should exist', () => {
    const dns = TestUtils.renderIntoDocument(
      <DNS/>
    )
    expect(TestUtils.isCompositeComponent(dns)).toBeTruthy()
  })
})
