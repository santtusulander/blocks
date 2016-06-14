import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../video.jsx')
const Video = require('../video.jsx')

describe('FilterVideo', () => {
  it('should exist', () => {
    const filter = TestUtils.renderIntoDocument(<Video/>)
    expect(TestUtils.isCompositeComponent(filter)).toBeTruthy()
  })
})
