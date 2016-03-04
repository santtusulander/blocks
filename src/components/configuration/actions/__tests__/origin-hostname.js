import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../origin-hostname.jsx')
const OriginHostname = require('../origin-hostname.jsx')

describe('OriginHostname', () => {
  it('should exist', () => {
    let originHostname = TestUtils.renderIntoDocument(
      <OriginHostname />
    );
    expect(TestUtils.isCompositeComponent(originHostname)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let originHostname = TestUtils.renderIntoDocument(
      <OriginHostname changeValue={changeValue}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(originHostname, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['edge_configuration', 'cache_rule', 'actions', 'origin_hostname_port'])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })
})
