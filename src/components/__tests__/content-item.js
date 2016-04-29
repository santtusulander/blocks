import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../content-item')
const ContentItem = require('../content-item')
const ContentItemList = require('../content-item-list')
const ContentItemChart = require('../content-item-chart')

describe('ContentItem', () => {
  it('should show a list if not a chart', () => {
    const renderer = TestUtils.createRenderer()
    renderer.render(<ContentItem isChart={false}/>);
    const contentItem = renderer.getRenderOutput()
    expect(contentItem.type).toEqual(ContentItemList);
  });
  it('should show a chart if a chart', () => {
    const renderer = TestUtils.createRenderer()
    renderer.render(<ContentItem isChart={true}/>);
    const contentItem = renderer.getRenderOutput()
    expect(contentItem.type).toEqual(ContentItemChart);
  });
})
