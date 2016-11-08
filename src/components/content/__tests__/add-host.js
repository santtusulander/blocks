import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.unmock('../add-host.jsx')
import AddHost from '../add-host.jsx'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('AddHost', () => {
  it('should exist', () => {
    let addHost = TestUtils.renderIntoDocument(
      <AddHost group={Immutable.Map()} intl={intlMaker()}/>
    );
    expect(TestUtils.isCompositeComponent(addHost)).toBeTruthy();
  })
  it('should create host on submit', () => {
    let createHost = jest.genMockFunction()
    let addHost = TestUtils.renderIntoDocument(
      <AddHost group={Immutable.Map()} createHost={createHost}
        intl={intlMaker()}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(addHost, 'input')
    inputs[0].value = 'new'
    let form = TestUtils.findRenderedDOMComponentWithTag(addHost, 'form')
    TestUtils.Simulate.submit(form)
    expect(createHost.mock.calls[0][0]).toEqual('new')
    expect(createHost.mock.calls[0][1]).toEqual('trial')
  })
})
