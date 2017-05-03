import React from 'react'
import { shallow } from 'enzyme'
import TestUtils from 'react-addons-test-utils'

jest.unmock('../../../shared/page-elements/input-connector')
jest.unmock('../cors.jsx')
import Cors from '../cors.jsx'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('Cors', () => {
  let subject = null

  beforeEach(() => {
    subject = () => {
      return shallow(<Cors intl={intlMaker()} />)
    }
  })

  it('should exist', () => {
    expect(subject()).toBeTruthy();
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
