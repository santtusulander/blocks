import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.dontMock('../analytics-page.jsx')
const AnalyticsPage = require('../analytics-page.jsx')
const PageContainer = require('../../layout/page-container.jsx')
const Analyses = require('../analyses.jsx')

describe('AnalyticsPage', () => {
  it('should exist', () => {
    const renderer = TestUtils.createRenderer()
    renderer.render(<AnalyticsPage/>);
    const result = renderer.getRenderOutput()
    expect(result.type).toEqual(PageContainer)
  });
  it('should have an Analyses sidebar', () => {
    const renderer = TestUtils.createRenderer()
    renderer.render(<AnalyticsPage/>);
    const result = renderer.getRenderOutput()
    expect(result.props.children[0].props.children.type).toEqual(Analyses)
  });
  it('should change tabs', () => {
    const page = TestUtils.renderIntoDocument(<AnalyticsPage/>)
    expect(page.state.activeTab).not.toEqual('aaa')
    page.changeTab('aaa')
    expect(page.state.activeTab).toEqual('aaa')
  });
  it('should change active video', () => {
    const page = TestUtils.renderIntoDocument(<AnalyticsPage/>)
    expect(page.state.activeVideo).not.toEqual('aaa')
    page.changeActiveVideo('aaa')
    expect(page.state.activeVideo).toEqual('aaa')
  });
})
