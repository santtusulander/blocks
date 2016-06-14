import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../on-off-net.jsx')
const OnOffNet = require('../on-off-net.jsx')

describe('FilterOnOffNet', () => {
  it('should exist', () => {
    const filter = TestUtils.renderIntoDocument(<OnOffNet/>)
    expect(TestUtils.isCompositeComponent(filter)).toBeTruthy()
  })
})
