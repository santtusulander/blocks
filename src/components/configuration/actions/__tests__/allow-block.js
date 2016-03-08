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

  it('should handle select changes', () => {
    let changeValue = jest.genMockFunction()
    let allowBlock = TestUtils.renderIntoDocument(
      <AllowBlock changeValue={changeValue}/>
    )
    expect(allowBlock.state.activeAccessControl).toBe('allow')
    allowBlock.handleSelectChange('activeAccessControl')('foo')
    expect(allowBlock.state.activeAccessControl).toBe('foo')
    expect(changeValue.mock.calls[0][1]).toBe('foo')
    expect(allowBlock.state.activeErrorResponse).toBe('301')
    allowBlock.handleSelectChange('activeErrorResponse')('bar')
    expect(allowBlock.state.activeErrorResponse).toBe('bar')
    expect(changeValue.mock.calls[1][1]).toBe('bar')
  })
})
