import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../horizontal-bar.jsx')
const AnalysisHorizontalBar = require('../horizontal-bar.jsx')

describe('AnalysisHorizontalBar', () => {
  it('should exist', () => {
    let chart = TestUtils.renderIntoDocument(
      <AnalysisHorizontalBar fetching={true}/>
    );
    expect(TestUtils.isCompositeComponent(chart)).toBeTruthy();
  });
})
