import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../query-string.jsx')
const QueryString = require('../query-string.jsx')

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('QueryString', () => {
  it('should exist', () => {
    let queryString = TestUtils.renderIntoDocument(
      <QueryString intl={intlMaker()} />
    );
    expect(TestUtils.isCompositeComponent(queryString)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let queryString = TestUtils.renderIntoDocument(
      <QueryString changeValue={changeValue} intl={intlMaker()}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(queryString, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['edge_configuration', 'cache_rule', 'actions', 'query_string_name'])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })

  it('should handle select changes', () => {
    let changeValue = jest.genMockFunction()
    let queryString = TestUtils.renderIntoDocument(
      <QueryString changeValue={changeValue} intl={intlMaker()}/>
    )
    expect(queryString.state.activeActivity).toBe('add')
    queryString.handleSelectChange('activeActivity')('foo')
    expect(queryString.state.activeActivity).toBe('foo')
    expect(changeValue.mock.calls[0][1]).toBe('foo')
    expect(queryString.state.activeDirection).toBe('to_origin')
    queryString.handleSelectChange('activeDirection')('bar')
    expect(queryString.state.activeDirection).toBe('bar')
    expect(changeValue.mock.calls[1][1]).toBe('bar')
  })
})
