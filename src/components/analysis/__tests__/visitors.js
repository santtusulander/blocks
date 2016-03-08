import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.autoMockOff()
jest.dontMock('../visitors.jsx')
const AnalysisVisitors = require('../visitors.jsx')

describe('AnalysisVisitors', () => {
  it('should exist', () => {
    let visitors = TestUtils.renderIntoDocument(
      <AnalysisVisitors fetching={true}/>
    );
    expect(TestUtils.isCompositeComponent(visitors)).toBeTruthy();
  });

  it('should show loading message if there is no data', () => {
    let visitors = TestUtils.renderIntoDocument(
      <AnalysisVisitors fetching={true}/>
    );
    let div = TestUtils.scryRenderedDOMComponentsWithTag(visitors, 'div')
    expect(div[0].textContent).toContain('Loading...');
  });
})
