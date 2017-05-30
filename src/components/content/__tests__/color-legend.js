import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { HOST_SERVICE_TYPES } from '../../../constants/configuration'

jest.unmock('../color-legend.jsx')
import ColorLegend from '../color-legend.jsx'

describe('ColorLegend', () => {
  it('should exist', () => {
    const renderer = TestUtils.createRenderer()
    renderer.render(<ColorLegend serviceTypes={[HOST_SERVICE_TYPES.MEDIA_DELIVERY]} />);
    const legend = renderer.getRenderOutput()
    expect(legend.type.defaultProps.bsClass).toEqual('row');
  })

  it('should return null when given empty list', () => {
    const renderer = TestUtils.createRenderer()
    renderer.render(<ColorLegend serviceTypes={[]} />);
    const legend = renderer.getRenderOutput()
    expect(legend).toEqual(null);
  })
})
