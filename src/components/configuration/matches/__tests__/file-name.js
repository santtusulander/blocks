import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../file-name.jsx')
const FileName = require('../file-name.jsx')

describe('DirectoryPath', () => {
  it('should exist', () => {
    let fileName = TestUtils.renderIntoDocument(
      <FileName />
    );
    expect(TestUtils.isCompositeComponent(fileName)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let fileName = TestUtils.renderIntoDocument(
      <FileName changeValue={changeValue}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(fileName, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['edge_configuration', 'cache_rule', 'matches', 'file_name_value'])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })
})
