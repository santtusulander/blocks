import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../allow-block.jsx')
const AllowBlock = require('../allow-block.jsx')

describe('AllowBlock', () => {
  it('should exist', () => {
    let allowBlock = TestUtils.renderIntoDocument(
      <AllowBlock />
    );
    expect(TestUtils.isCompositeComponent(allowBlock)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let allowBlock = TestUtils.renderIntoDocument(
      <AllowBlock changeValue={changeValue}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(allowBlock, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['edge_configuration', 'cache_rule', 'actions', 'allow_block_redirect_url'])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })
})
