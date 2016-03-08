import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../header.jsx')
const Header = require('../header.jsx')

describe('Header', () => {
  it('should exist', () => {
    let header = TestUtils.renderIntoDocument(
      <Header />
    );
    expect(TestUtils.isCompositeComponent(header)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let header = TestUtils.renderIntoDocument(
      <Header changeValue={changeValue}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(header, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['edge_configuration', 'cache_rule', 'actions', 'header_name'])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })

  it('should handle select changes', () => {
    let changeValue = jest.genMockFunction()
    let header = TestUtils.renderIntoDocument(
      <Header changeValue={changeValue}/>
    )
    expect(header.state.activeActivity).toBe('add')
    header.handleSelectChange('activeActivity')('foo')
    expect(header.state.activeActivity).toBe('foo')
    expect(changeValue.mock.calls[0][1]).toBe('foo')
    expect(header.state.activeDirection).toBe('to_origin')
    header.handleSelectChange('activeDirection')('bar')
    expect(header.state.activeDirection).toBe('bar')
    expect(changeValue.mock.calls[1][1]).toBe('bar')
  })
})
