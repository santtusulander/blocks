import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../mime-type.jsx')
const MimeType = require('../mime-type.jsx')

describe('MimeType', () => {
  it('should exist', () => {
    let mimeType = TestUtils.renderIntoDocument(
      <MimeType />
    );
    expect(TestUtils.isCompositeComponent(mimeType)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let mimeType = TestUtils.renderIntoDocument(
      <MimeType changeValue={changeValue}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(mimeType, 'textarea')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['edge_configuration', 'cache_rule', 'matches', 'mime_types_value'])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })
})
