import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../visitors.jsx')
const AnalysisVisitors = require('../visitors.jsx')

describe('AnalysisVisitors', () => {
  it('should exist', () => {
    let visitors = TestUtils.renderIntoDocument(
      <AnalysisVisitors fetching={true}/>
    );
    expect(TestUtils.isCompositeComponent(visitors)).toBeTruthy();
  });
})
