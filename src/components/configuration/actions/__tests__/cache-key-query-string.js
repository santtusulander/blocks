import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../cache-key-query-string.jsx')
const CacheKeyQueryString = require('../cache-key-query-string.jsx')

describe('CacheKeyQueryString', () => {
  it('should exist', () => {
    let cacheKeyQueryString = TestUtils.renderIntoDocument(
      <CacheKeyQueryString />
    );
    expect(TestUtils.isCompositeComponent(cacheKeyQueryString)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let cacheKeyQueryString = TestUtils.renderIntoDocument(
      <CacheKeyQueryString changeValue={changeValue}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(cacheKeyQueryString, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['edge_configuration', 'cache_rule', 'actions', 'cache_key_value'])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })
})
