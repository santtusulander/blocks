import React from 'react'
import {shallow} from 'enzyme'

jest.dontMock('../on-off-net.jsx')
const OnOffNet = require('../on-off-net.jsx').default

describe('FilterOnOffNet', () => {
  it('should exist', () => {
    const filter = shallow(<OnOffNet/>)
    expect(filter.length).toBe(1)
  })
})
