import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../stacked.jsx')
const AnalysisStacked = require('../stacked.jsx')

describe('AnalysisStacked', () => {
  it('should exist', () => {
    let stacks = TestUtils.renderIntoDocument(
      <AnalysisStacked />
    );
    expect(TestUtils.isCompositeComponent(stacks)).toBeTruthy();
  });
});
