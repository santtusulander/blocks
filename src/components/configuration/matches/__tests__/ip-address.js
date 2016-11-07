import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../ip-address.jsx')
import IpAddress from '../ip-address.jsx'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

const fakeConfig = Immutable.fromJS({
  "cases": [["foo"]]
})

const fakePath = ['foo', 'bar']

describe('IpAddress', () => {
  it('should exist', () => {
    let ipAddress = shallow(
      <IpAddress match={fakeConfig} path={fakePath} intl={intlMaker()}/>
    );
    expect(ipAddress).toBeDefined();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let ipAddress = shallow(
      <IpAddress changeValue={changeValue} match={fakeConfig} path={fakePath}
        intl={intlMaker()}/>
    )
    let inputs = ipAddress.find('Input')
    inputs.at(1).simulate('change', {target: {value: 'new'}})
    expect(changeValue.mock.calls[0][0]).toEqual(['edge_configuration', 'cache_rule', 'matches', 'ip_address_include_x_forwarded_for'])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })

  it('should update the parameters as select change happens', () => {
    let changeValue = jest.genMockFunction()
    let ipAddress = shallow(
      <IpAddress changeValue={changeValue} match={fakeConfig} path={fakePath}
        intl={intlMaker()}/>
    )
    expect(ipAddress.state('activeFilter')).toBe('matches')
    ipAddress.instance().handleSelectChange('activeFilter')('foo')
    expect(ipAddress.state('activeFilter')).toBe('foo')
    expect(changeValue.mock.calls[0][1]).toBe('foo')
  })
})
