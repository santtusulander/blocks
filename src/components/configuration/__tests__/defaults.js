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
        "check_etag": "weak",
        "max_age": 10
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

  it('should change ttl value based on unit', () => {
    const agePath = ['default_policy','policy_rules',0,'set','cache_control','max_age']
    const changeValue = jest.genMockFunction()
    let defaults = TestUtils.renderIntoDocument(
      <ConfigurationDefaults changeValue={changeValue}
        config={fakeConfig}/>
    );
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(defaults, 'input')
    inputs[0].value = 30
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0].toJS()).toEqual(agePath)
    expect(changeValue.mock.calls[0][1]).toBe(30)
    defaults.changeTTLUnit(agePath)('minutes')
    expect(changeValue.mock.calls[1][0]).toEqual(agePath)
    expect(changeValue.mock.calls[1][1]).toBe(600)
  });
})
