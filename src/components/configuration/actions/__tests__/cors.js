import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../cors.jsx')
const Cors = require('../cors.jsx')

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('Cors', () => {
  it('should exist', () => {
    let cors = TestUtils.renderIntoDocument(
      <Cors intl={intlMaker()} />
    );
    expect(TestUtils.isCompositeComponent(cors)).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let cors = TestUtils.renderIntoDocument(
      <Cors changeValue={changeValue} intl={intlMaker()}/>
    )
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(cors, 'input')
    inputs[0].value = 'new'
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(['edge_configuration', 'cache_rule', 'actions', 'cors_support_head'])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })
})
