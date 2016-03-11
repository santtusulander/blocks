import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.dontMock('../policies.jsx')
const ConfigurationPolicies = require('../policies.jsx')

const fakeConfig = Immutable.fromJS({"default_policy": {"policy_rules": [
  {
    "set": {
      "cache_control": {
        "honor_origin": true,
        "check_etag": "weak"
      }
    }
  },
  {
    "set": {
      "cache_name": {
        "ignore_case": false
      }
    }
  }
]}})

describe('ConfigurationPolicies', () => {
  it('should exist', () => {
    let policies = TestUtils.renderIntoDocument(
      <ConfigurationPolicies />
    );
    expect(TestUtils.isCompositeComponent(policies)).toBeTruthy();
  });

  it('should change values', () => {
    const changeValue = jest.genMockFunction()
    let policies = TestUtils.renderIntoDocument(
      <ConfigurationPolicies changeValue={changeValue}
        config={fakeConfig}/>
    );
    policies.handleChange('some path')(true)
    expect(changeValue.mock.calls[0][0]).toEqual('some path')
    expect(changeValue.mock.calls[0][1]).toBe(true)
  });
})
