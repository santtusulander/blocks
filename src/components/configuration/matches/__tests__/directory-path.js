import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../directory-path.jsx')
const DirectoryPath = require('../directory-path.jsx')

describe('DirectoryPath', () => {
  it('should exist', () => {
    let directoryPath = TestUtils.renderIntoDocument(
      <DirectoryPath />
    );
    expect(TestUtils.isCompositeComponent(directoryPath)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let directoryPath = TestUtils.renderIntoDocument(
      <DirectoryPath changeValue={changeValue}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(directoryPath, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['edge_configuration', 'cache_rule', 'matches', 'path_value'])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })
})
