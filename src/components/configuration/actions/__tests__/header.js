import React from 'react'
import { Map } from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../header.jsx')
import Header from '../header.jsx'

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

  //TODO-2277

  // it('should update the parameters as changes happen', () => {
  //   let header = shallow(
  //     <Header set={Map()} intl={intlMaker()} />
  //   )
  //   let inputs = header.find('FormControl')
  //   inputs.at(0).simulate('change', {target: {value: 'new'}})
  //   expect(header.state('to_header')).toEqual('new')
  // })

  // it('should handle select changes', () => {
  //   let header = shallow(
  //     <Header set={Map()} intl={intlMaker()} />
  //   )
  //   expect(header.state('activeActivity')).toBe('set')
  //   header.instance().handleSelectChange('activeActivity')('foo')
  //   expect(header.state('activeActivity')).toBe('foo')
  // })
})
