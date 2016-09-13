import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { Map } from 'immutable'

jest.dontMock('../header.jsx')
const Header = require('../header.jsx')

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('Header', () => {
  it('should exist', () => {
    let header = TestUtils.renderIntoDocument(
      <Header set={Map()} intl={intlMaker()} />
    );
    expect(TestUtils.isCompositeComponent(header)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let header = TestUtils.renderIntoDocument(
      <Header set={Map()} intl={intlMaker()} />
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(header, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(header.state.to_header).toEqual('new')
  })

  it('should handle select changes', () => {
    let header = TestUtils.renderIntoDocument(
      <Header set={Map()} intl={intlMaker()} />
    )
    expect(header.state.activeActivity).toBe('set')
    header.handleSelectChange('activeActivity')('foo')
    expect(header.state.activeActivity).toBe('foo')
    expect(header.state.activeDirection).toBe('to_origin')
    header.handleSelectChange('activeDirection')('bar')
    expect(header.state.activeDirection).toBe('bar')
  })
})
