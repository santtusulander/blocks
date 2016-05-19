import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

import { shallow, render, mount } from 'enzyme'

jest.dontMock('../analytics-page.jsx')
const AnalyticsPage = require('../analytics-page.jsx')

describe('AnalyticsPage', () => {
  it('should exist', () => {
    const page = shallow(<AnalyticsPage />)
    expect(page.find('PageContainer').length).toBe(1)
  });

  it('should have an Analyses sidebar', () => {
    const page = shallow(<AnalyticsPage />)
    expect(page.find('Analyses').length).toBe(1)
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
