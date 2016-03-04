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
})
