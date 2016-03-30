import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../path.jsx')
const Path = require('../path.jsx')

describe('Path', () => {
  it('should exist', () => {
    let path = TestUtils.renderIntoDocument(
      <Path />
    );
    expect(TestUtils.isCompositeComponent(path)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let path = TestUtils.renderIntoDocument(
      <Path changeValue={changeValue}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(path, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['edge_configuration', 'cache_rule', 'actions', 'path_value'])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })

  it('should handle select changes', () => {
    let changeValue = jest.genMockFunction()
    let path = TestUtils.renderIntoDocument(
      <Path changeValue={changeValue}/>
    )
    expect(path.state.activeActivity).toBe('add')
    path.handleSelectChange('activeActivity')('foo')
    expect(path.state.activeActivity).toBe('foo')
    expect(changeValue.mock.calls[0][1]).toBe('foo')
    expect(path.state.activeDirection).toBe('to_origin')
    path.handleSelectChange('activeDirection')('bar')
    expect(path.state.activeDirection).toBe('bar')
    expect(changeValue.mock.calls[1][1]).toBe('bar')
  })
})
