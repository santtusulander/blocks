import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../policy-rules.jsx')
const ConfigurationPolicyRules = require('../policy-rules.jsx')

describe('ConfigurationPolicyRules', () => {
  it('should exist', () => {
    let policyRules = TestUtils.renderIntoDocument(
      <ConfigurationPolicyRules />
    );
    expect(TestUtils.isCompositeComponent(policyRules)).toBeTruthy();
  });
})
