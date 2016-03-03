import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../ip-address.jsx')
const IpAddress = require('../ip-address.jsx')

describe('IpAddress', () => {
  it('should exist', () => {
    let ipAddress = TestUtils.renderIntoDocument(
      <IpAddress />
    );
    expect(TestUtils.isCompositeComponent(ipAddress)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let ipAddress = TestUtils.renderIntoDocument(
      <IpAddress changeValue={changeValue}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(ipAddress, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['edge_configuration', 'cache_rule', 'matches', 'ip_address_include_x_forwarded_for'])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })
})
