import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../../layout/section-header.jsx')
jest.unmock('../../layout/section-container.jsx')
jest.unmock('../defaults.jsx')
jest.unmock('../helpers.js')
import ConfigurationDefaults from '../defaults.jsx'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

const fakeConfig = Immutable.fromJS({
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

  // it('should change ttl value based on unit', () => {
  //   const agePath = Immutable.List(['default_policy','policy_rules',0,'set','cache_control','max_age'])
  //   const changeValue = jest.fn()
  //   const defaults = shallow(
  //     <ConfigurationDefaults changeValue={changeValue} intl={intlMaker()}
  //       config={fakeConfig}/>
  //   )

  //   defaults.instance().changeTTLValue(agePath)(30)
  //   expect(changeValue.mock.calls[0][0].toJS()).toEqual(agePath.toJS())
  //   expect(changeValue.mock.calls[0][1]).toBe(30)

  //   defaults.instance().changeTTLUnit(agePath)('minutes')
  //   expect(changeValue.mock.calls[1][0]).toEqual(agePath)
  //   expect(changeValue.mock.calls[1][1]).toBe(600)
  // });
})
