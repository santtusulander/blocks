import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { Map } from 'immutable'

jest.dontMock('../cache-key-query-string.jsx')
const CacheKeyQueryString = require('../cache-key-query-string.jsx')

describe('CacheKeyQueryString', () => {
  it('should exist', () => {
    let cacheKeyQueryString = TestUtils.renderIntoDocument(
      <CacheKeyQueryString set={Map()} />
    );
    expect(TestUtils.isCompositeComponent(cacheKeyQueryString)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let cacheKeyQueryString = TestUtils.renderIntoDocument(
      <CacheKeyQueryString set={Map()}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(cacheKeyQueryString, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(cacheKeyQueryString.state.queryArgs.get(0)).toEqual('new')
  })

  it('should handle select changes', () => {
    let cacheKeyQueryString = TestUtils.renderIntoDocument(
      <CacheKeyQueryString set={Map()} />
    )
    expect(cacheKeyQueryString.state.activeFilter).toBe('ignore_all_query_parameters')
    cacheKeyQueryString.handleSelectChange('foo')
    expect(cacheKeyQueryString.state.activeFilter).toBe('foo')
  })
})
