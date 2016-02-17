import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.autoMockOff()
jest.dontMock('../analyses.jsx')
const Analyses = require('../analyses.jsx').Analyses

describe('Analyses', () => {
  it('should exist', () => {
    let analyses = TestUtils.renderIntoDocument(
      <Analyses />
    );
    expect(TestUtils.isCompositeComponent(analyses)).toBeTruthy();
  });
})
