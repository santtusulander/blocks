import React from 'react'
import { shallow } from 'enzyme';
import { Map } from 'immutable'

jest.unmock('../home.jsx')
import Home from '../home.jsx'

describe('Home', () => {
  it('should exist', () => {
    let wrapper = shallow(<Home activeAccount={{}} currentUser={new Map()} router={{}} />)
    expect(wrapper).toBeTruthy()
  })
})
