import React from 'react'
import {shallow} from 'enzyme'

jest.unmock('../on-off-net.jsx')
import OnOffNet from '../on-off-net.jsx'

describe('FilterOnOffNet', () => {
  it('should exist', () => {
    const filter = shallow(<OnOffNet/>)
    expect(filter.length).toBe(1)
  })
})
