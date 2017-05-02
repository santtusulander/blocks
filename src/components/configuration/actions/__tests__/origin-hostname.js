import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.unmock('../../../shared/page-elements/input-connector')
jest.unmock('../origin-hostname.jsx')
import OriginHostname from '../origin-hostname.jsx'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('OriginHostname', () => {
  it('should exist', () => {
    let originHostname = TestUtils.renderIntoDocument(
      <OriginHostname intl={intlMaker()} />
    );
    expect(TestUtils.isCompositeComponent(originHostname)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let originHostname = TestUtils.renderIntoDocument(
      <OriginHostname changeValue={changeValue} intl={intlMaker()}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(originHostname, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['edge_configuration', 'cache_rule', 'actions', 'origin_hostname_port'])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })
})
