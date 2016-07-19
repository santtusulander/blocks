import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../on-off-net.jsx')
const OnOffNet = require('../on-off-net.jsx')

describe('FilterOnOffNet', () => {
  it('should exist', () => {
    const renderer = TestUtils.createRenderer()
    renderer.render(<OnOffNet/>);
    const filter = renderer.getRenderOutput()
    expect(filter.type).toEqual('div');
  })
})
