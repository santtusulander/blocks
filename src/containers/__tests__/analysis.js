import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../analysis.jsx')
const Analysis = require('../analysis.jsx')

describe('Analysis', () => {
  it('should exist', () => {
    let analysis = TestUtils.renderIntoDocument(
      <Analysis />
    );
    expect(TestUtils.isCompositeComponent(analysis)).toBeTruthy();
  });
})
