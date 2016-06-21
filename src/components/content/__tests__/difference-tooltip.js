import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../difference-tooltip.jsx')
const Tooltip = require('../difference-tooltip.jsx')

describe('ContentDifferenceTooltip', () => {
  it('should exist', () => {
    const renderer = TestUtils.createRenderer()
    renderer.render(<Tooltip/>);
    const tooltip = renderer.getRenderOutput()
    expect(tooltip.type).toEqual('div');
  })
})
