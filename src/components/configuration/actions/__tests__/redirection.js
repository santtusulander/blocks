import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../redirection.jsx')
const Redirection = require('../redirection.jsx')

describe('Redirection', () => {
  it('should exist', () => {
    let redirection = TestUtils.renderIntoDocument(
      <Redirection />
    );
    expect(TestUtils.isCompositeComponent(redirection)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let redirection = TestUtils.renderIntoDocument(
      <Redirection changeValue={changeValue}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(redirection, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['edge_configuration', 'cache_rule', 'actions', 'redirection_domain'])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })

  it('should handle select changes', () => {
    let changeValue = jest.genMockFunction()
    let redirection = TestUtils.renderIntoDocument(
      <Redirection changeValue={changeValue}/>
    )
    expect(redirection.state.activeProtocol).toBe('http')
    redirection.handleSelectChange('activeProtocol')('foo')
    expect(redirection.state.activeProtocol).toBe('foo')
    expect(changeValue.mock.calls[0][1]).toBe('foo')
    expect(redirection.state.activeRedirectionType).toBe('301')
    redirection.handleSelectChange('activeRedirectionType')('bar')
    expect(redirection.state.activeRedirectionType).toBe('bar')
    expect(changeValue.mock.calls[1][1]).toBe('bar')
  })
})
