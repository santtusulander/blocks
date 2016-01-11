import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../security.jsx')
const ConfigurationSecurity = require('../security.jsx')

describe('ConfigurationSecurity', () => {
  it('should exist', () => {
    let security = TestUtils.renderIntoDocument(
      <ConfigurationSecurity />
    );
    expect(TestUtils.isCompositeComponent(security)).toBeTruthy();
  });
})
