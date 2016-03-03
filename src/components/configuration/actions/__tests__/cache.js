import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../cache.jsx')
const Cache = require('../cache.jsx')

describe('Cache', () => {
  it('should exist', () => {
    let cache = TestUtils.renderIntoDocument(
      <Cache />
    );
    expect(TestUtils.isCompositeComponent(cache)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let cache = TestUtils.renderIntoDocument(
      <Cache changeValue={changeValue}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(cache, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['edge_configuration', 'cache_rule', 'actions', 'cache_ttl_value'])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })
})
