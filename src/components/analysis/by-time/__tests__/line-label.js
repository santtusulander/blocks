import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../line-label.jsx')
const AnalysisLineLabel = require('../line-label.jsx')

describe('AnalysisLineLabel', () => {
  it('should exist', () => {
    let lineLabel = TestUtils.renderIntoDocument(
      <AnalysisLineLabel />
    );
    expect(TestUtils.isCompositeComponent(lineLabel)).toBeTruthy();
  });
})
