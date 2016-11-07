import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.unmock('../difference-tooltip.jsx')
import Tooltip from '../difference-tooltip.jsx'

describe('ContentDifferenceTooltip', () => {
  it('should exist', () => {
    const renderer = TestUtils.createRenderer()
    renderer.render(<Tooltip/>);
    const tooltip = renderer.getRenderOutput()
    expect(tooltip.type).toEqual('div');
  })
})
