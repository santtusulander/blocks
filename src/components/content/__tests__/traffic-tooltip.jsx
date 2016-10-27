import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.unmock('../traffic-tooltip.jsx')
import Tooltip from '../traffic-tooltip.jsx'

describe('ContentTrafficTooltip', () => {
  it('should exist', () => {
    const renderer = TestUtils.createRenderer()
    renderer.render(<Tooltip/>);
    const tooltip = renderer.getRenderOutput()
    expect(tooltip.type).toEqual('div');
  })
})
