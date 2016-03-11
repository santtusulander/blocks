import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../diff-bar.jsx')
const ConfigurationDiffBar = require('../diff-bar.jsx')

describe('ConfigurationDiffBar', () => {
  it('should exist', () => {
    let diffBar = TestUtils.renderIntoDocument(
      <ConfigurationDiffBar />
    );
    expect(TestUtils.isCompositeComponent(diffBar)).toBeTruthy();
  });
})
