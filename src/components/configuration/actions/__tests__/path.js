import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../path.jsx')
import Path from '../path.jsx'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('Path', () => {
  it('should exist', () => {
    let path = shallow(
      <Path intl={intlMaker()} />
    );
    expect(path).toBeDefined();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let path = shallow(
      <Path changeValue={changeValue} intl={intlMaker()}/>
    )
    let inputs = path.find('Input')
    inputs.at(0).simulate('change', {target: {value: 'new'}})
    expect(changeValue.mock.calls[0][0]).toEqual(['edge_configuration', 'cache_rule', 'actions', 'path_value'])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })

  it('should handle select changes', () => {
    let changeValue = jest.genMockFunction()
    let path = shallow(
      <Path changeValue={changeValue} intl={intlMaker()}/>
    )
    expect(path.state('activeActivity')).toBe('add')
    path.instance().handleSelectChange('activeActivity')('foo')
    expect(path.state('activeActivity')).toBe('foo')
    expect(changeValue.mock.calls[0][1]).toBe('foo')
    expect(path.state('activeDirection')).toBe('to_origin')
    path.instance().handleSelectChange('activeDirection')('bar')
    expect(path.state('activeDirection')).toBe('bar')
    expect(changeValue.mock.calls[1][1]).toBe('bar')
  })
})
