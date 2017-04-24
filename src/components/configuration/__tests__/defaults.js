import React from 'react'
import { List, fromJS } from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../../shared/layout/section-header.jsx')
jest.unmock('../../shared/layout/section-container.jsx')
jest.unmock('../defaults.jsx')
jest.unmock('../helpers.js')
import ConfigurationDefaults from '../defaults.jsx'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

const fakeConfig = fromJS({
  "defaults": {
    "cache_control_max_age": null,
    "cache_key_query": null,
    "cache_control_check_etag": "false",
    "response_remove_vary": true,
    "cache_control_honor_origin": false,
    "cache_name_ignore_case": true
  }
})

describe('ConfigurationDefaults', () => {
  let handleSubmit, close, change, changeValue, component

  beforeEach(() => {
    handleSubmit = jest.fn()
    close = jest.fn()
    changeValue = jest.fn()
    change = jest.fn()

    let props = {
      changeValue,
      handleSubmit,
      change,
      close,
      invalid: false,
      ttlValue: 30,
      intl: intlMaker()
    }

    component = shallow(<ConfigurationDefaults {...props} />)
  })

  it('should exist', () => {
    expect(component).toBeDefined()
  })

  it('should change values', () => {
    component.instance().handleChange('some path')({}, true)
 
    expect(changeValue.mock.calls[0][0]).toEqual('some path')
    expect(changeValue.mock.calls[0][1]).toBe(true)
  })

  it('should change ttl value based on unit', () => {
    component.instance().handleTtlValueChange(["defaults", "cache_control_max_age"])({}, 30)

    expect(changeValue.mock.calls[0][0]).toEqual(["defaults", "cache_control_max_age"])
    expect(changeValue.mock.calls[0][1]).toBe(30)

    component.instance().handleTtlUnitChange(["defaults", "cache_control_max_age"])({}, 'minutes')
    expect(changeValue.mock.calls[1][0]).toEqual(["defaults", "cache_control_max_age"])
    expect(changeValue.mock.calls[1][1]).toBe(1800)
  })
})
