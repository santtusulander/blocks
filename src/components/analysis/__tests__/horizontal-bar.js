import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.unmock('../horizontal-bar.jsx')
import AnalysisHorizontalBar from '../horizontal-bar.jsx'

describe('AnalysisHorizontalBar', () => {
  it('should exist', () => {
    let chart = TestUtils.renderIntoDocument(
      <AnalysisHorizontalBar fetching={true}/>
    );
    expect(TestUtils.isCompositeComponent(chart)).toBeTruthy();
  });
})
