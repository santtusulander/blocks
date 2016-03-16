import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.dontMock('../defaults.jsx')
const ConfigurationDefaults = require('../defaults.jsx')

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

describe('ConfigurationDefaults', () => {
  it('should exist', () => {
    let defaults = TestUtils.renderIntoDocument(
      <ConfigurationDefaults />
    );
    expect(TestUtils.isCompositeComponent(defaults)).toBeTruthy();
  });

  it('should change values', () => {
    const changeValue = jest.genMockFunction()
    let defaults = TestUtils.renderIntoDocument(
      <ConfigurationDefaults changeValue={changeValue}
        config={fakeConfig}/>
    );
    defaults.handleChange('some path')(true)
    expect(changeValue.mock.calls[0][0]).toEqual('some path')
    expect(changeValue.mock.calls[0][1]).toBe(true)
  });
})
