import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../video.jsx')
import Video from '../video.jsx'

describe('FilterVideo', () => {
  it('should exist', () => {
    expect(shallow(<Video/>)).toBeTruthy()
  })
})
