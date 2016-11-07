import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../query-string.jsx')
import QueryString from '../query-string.jsx'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('QueryString', () => {
  it('should exist', () => {
    let queryString = shallow(
      <QueryString intl={intlMaker()} />
    );
    expect(queryString).toBeDefined();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let queryString = shallow(
      <QueryString changeValue={changeValue} intl={intlMaker()}/>
    )
    let inputs = queryString.find('Input')
    inputs.at(0).simulate('change', {target: {value: 'new'}})
    expect(changeValue.mock.calls[0][0]).toEqual(['edge_configuration', 'cache_rule', 'actions', 'query_string_name'])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })

  it('should handle select changes', () => {
    let changeValue = jest.genMockFunction()
    let queryString = shallow(
      <QueryString changeValue={changeValue} intl={intlMaker()}/>
    )
    expect(queryString.state('activeActivity')).toBe('add')
    queryString.instance().handleSelectChange('activeActivity')('foo')
    expect(queryString.state('activeActivity')).toBe('foo')
    expect(changeValue.mock.calls[0][1]).toBe('foo')
    expect(queryString.state('activeDirection')).toBe('to_origin')
    queryString.instance().handleSelectChange('activeDirection')('bar')
    expect(queryString.state('activeDirection')).toBe('bar')
    expect(changeValue.mock.calls[1][1]).toBe('bar')
  })
})
