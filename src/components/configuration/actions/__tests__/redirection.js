import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../redirection.jsx')
import Redirection from '../redirection.jsx'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('Redirection', () => {
  it('should exist', () => {
    let redirection = shallow(
      <Redirection intl={intlMaker()} />
    );
    expect(redirection).toBeDefined();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let redirection = shallow(
      <Redirection changeValue={changeValue} intl={intlMaker()}/>
    )
    let inputs = redirection.find('Input')
    inputs.at(0).simulate('change', {target: {value: 'new'}})
    expect(changeValue.mock.calls[0][0]).toEqual(['edge_configuration', 'cache_rule', 'actions', 'redirection_domain'])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })

  it('should handle select changes', () => {
    let changeValue = jest.genMockFunction()
    let redirection = shallow(
      <Redirection changeValue={changeValue} intl={intlMaker()}/>
    )
    expect(redirection.state('activeProtocol')).toBe('http')
    redirection.instance().handleSelectChange('activeProtocol')('foo')
    expect(redirection.state('activeProtocol')).toBe('foo')
    expect(changeValue.mock.calls[0][1]).toBe('foo')
    expect(redirection.state('activeRedirectionType')).toBe('301')
    redirection.instance().handleSelectChange('activeRedirectionType')('bar')
    expect(redirection.state('activeRedirectionType')).toBe('bar')
    expect(changeValue.mock.calls[1][1]).toBe('bar')
  })
})
