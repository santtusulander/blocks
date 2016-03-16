import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.autoMockOff()
jest.dontMock('../query-string.jsx')
const QueryString = require('../query-string.jsx')

const fakeConfig = Immutable.fromJS({
  "cases": [["foo"]]
})

const fakePath = ['foo', 'bar']

describe('QueryString', () => {
  it('should exist', () => {
    let queryString = TestUtils.renderIntoDocument(
      <QueryString match={fakeConfig} path={fakePath}/>
    );
    expect(TestUtils.isCompositeComponent(queryString)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let queryString = TestUtils.renderIntoDocument(
      <QueryString changeValue={changeValue} match={fakeConfig} path={fakePath}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(queryString, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['foo', 'bar', 'cases', 0, 0])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })

  it('should handle select changes', () => {
    let changeValue = jest.genMockFunction()
    let queryString = TestUtils.renderIntoDocument(
      <QueryString changeValue={changeValue} match={fakeConfig} path={fakePath}/>
    )
    expect(queryString.state.activeFilter).toBe('exists')
    queryString.handleSelectChange('activeFilter')('foo')
    expect(queryString.state.activeFilter).toBe('foo')
    expect(changeValue.mock.calls[0][1]).toBe('foo')
  })
})
