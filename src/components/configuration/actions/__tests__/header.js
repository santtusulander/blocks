import React from 'react'
import { Map } from 'immutable'
import { shallow } from 'enzyme'

jest.dontMock('../header.jsx')
const Header = require('../header.jsx')

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('Header', () => {
  it('should exist', () => {
    let header = shallow(
      <Header set={Map()} intl={intlMaker()} />
    );
    expect(header).toBeTruthy();
  })

  it('should update the parameters as changes happen', () => {
    let header = shallow(
      <Header set={Map()} intl={intlMaker()} />
    )
    let inputs = header.find('Input')
    inputs.at(0).simulate('change', {target: {value: 'new'}})
    expect(header.state('to_header')).toEqual('new')
  })

  it('should handle select changes', () => {
    let header = shallow(
      <Header set={Map()} intl={intlMaker()} />
    )
    expect(header.state('activeActivity')).toBe('set')
    header.instance().handleSelectChange('activeActivity')('foo')
    expect(header.state('activeActivity')).toBe('foo')
    expect(header.state('activeDirection')).toBe('to_origin')
    header.instance().handleSelectChange('activeDirection')('bar')
    expect(header.state('activeDirection')).toBe('bar')
  })
})
