import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../file-extension.jsx')
const FileExtension = require('../file-extension.jsx')

describe('DirectoryPath', () => {
  it('should exist', () => {
    let fileExtension = TestUtils.renderIntoDocument(
      <FileExtension />
    );
    expect(TestUtils.isCompositeComponent(fileExtension)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let fileExtension = TestUtils.renderIntoDocument(
      <FileExtension changeValue={changeValue}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(fileExtension, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['edge_configuration', 'cache_rule', 'matches', 'file_extension_value'])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })
})
