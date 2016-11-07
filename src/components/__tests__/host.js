import React from 'react'
import {shallow} from 'enzyme'

jest.unmock('../host.jsx')
import Host from '../host.jsx'

describe('Host', () => {
  it('should exist', () => {
    const host = shallow(<Host/>)
    expect(host.length).toEqual(1);
  })
  it('should delete', () => {
    let deleteFunc = jest.fn()
    let deleteHost = shallow(<Host delete={deleteFunc}/>)
    deleteHost.find('a').simulate('click', {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn()
    })
    expect(deleteFunc.mock.calls.length).toEqual(1)
  })
})
