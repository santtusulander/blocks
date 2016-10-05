import React from 'react'
import Immutable from 'immutable'
import {shallow, mount} from 'enzyme'

jest.autoMockOff()
jest.dontMock('../helpers.js')
jest.dontMock('../defaults.jsx')
jest.dontMock('../actions/cache-key-query-string-form.jsx')
jest.dontMock('../policy-rules.jsx')
jest.dontMock('../../icons/icon-add.jsx')
jest.dontMock('../../icon.jsx')
const ConfigurationDefaults = require('../defaults.jsx')

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

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
    const defaults = shallow(<ConfigurationDefaults />)
    expect(defaults).toBeDefined()
  })

  it('should change values', () => {
    const changeValue = jest.fn()
    const defaults = shallow(
      <ConfigurationDefaults changeValue={changeValue} intl={intlMaker()}
        config={fakeConfig}/>
    )
    defaults.instance().handleChange('some path')(true)
    expect(changeValue.mock.calls[0][0]).toEqual('some path')
    expect(changeValue.mock.calls[0][1]).toBe(true)
  });

  it('should change ttl value based on unit', () => {
    const agePath = Immutable.List(['default_policy','policy_rules',0,'set','cache_control','max_age'])
    const changeValue = jest.fn()
    const defaults = mount(
      <ConfigurationDefaults changeValue={changeValue} intl={intlMaker()}
        config={fakeConfig}/>
    )
    const ttlInput = defaults.find('.ttl-value')
    ttlInput.simulate('change', {target: {value: 30}})
    expect(changeValue.mock.calls[0][0].toJS()).toEqual(agePath.toJS())
    expect(changeValue.mock.calls[0][1]).toBe(30)
    defaults.instance().changeTTLUnit(agePath)('minutes')
    expect(changeValue.mock.calls[1][0]).toEqual(agePath)
    expect(changeValue.mock.calls[1][1]).toBe(600)
  });
})
