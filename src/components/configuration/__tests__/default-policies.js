import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../default-policies.jsx')
const ConfigurationDefaultPolicies = require('../default-policies.jsx')

describe('ConfigurationDefaultPolicies', () => {
  it('should exist', () => {
    let defaultPolicies = TestUtils.renderIntoDocument(
      <ConfigurationDefaultPolicies />
    );
    expect(TestUtils.isCompositeComponent(defaultPolicies)).toBeTruthy();
  });
})
