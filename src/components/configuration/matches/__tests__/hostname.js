import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../hostname.jsx')
const Hostname = require('../hostname.jsx')

describe('Hostname', () => {
  it('should exist', () => {
    let hostname = TestUtils.renderIntoDocument(
      <Hostname />
    );
    expect(TestUtils.isCompositeComponent(hostname)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let hostname = TestUtils.renderIntoDocument(
      <Hostname changeValue={changeValue}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(hostname, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['edge_configuration', 'cache_rule', 'matches', 'hostname_value'])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })
})
