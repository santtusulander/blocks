import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../query-string.jsx')
const QueryString = require('../query-string.jsx')

describe('QueryString', () => {
  it('should exist', () => {
    let queryString = TestUtils.renderIntoDocument(
      <QueryString />
    );
    expect(TestUtils.isCompositeComponent(queryString)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let queryString = TestUtils.renderIntoDocument(
      <QueryString changeValue={changeValue}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(queryString, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['edge_configuration', 'cache_rule', 'actions', 'query_string_name'])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })
})
