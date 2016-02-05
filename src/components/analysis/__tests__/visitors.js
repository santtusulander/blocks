import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../visitors.jsx')
const AnalysisVisitors = require('../visitors.jsx')

describe('AnalysisVisitors', () => {
  it('should exist', () => {
    let visitors = TestUtils.renderIntoDocument(
      <AnalysisVisitors
        byTime={Immutable.List()}
        byCountry={Immutable.List()}/>
    );
    expect(TestUtils.isCompositeComponent(visitors)).toBeTruthy();
  });
})
