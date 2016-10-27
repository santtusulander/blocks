import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.unmock('../video.jsx')
import Video from '../video.jsx'

describe('FilterVideo', () => {
  it('should exist', () => {
    const filter = TestUtils.renderIntoDocument(<Video/>)
    expect(TestUtils.isCompositeComponent(filter)).toBeTruthy()
  })
})
