import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.unmock('../diff-bar.jsx')
import ConfigurationDiffBar from '../diff-bar.jsx'

describe('ConfigurationDiffBar', () => {
  it('should exist', () => {
    let diffBar = TestUtils.renderIntoDocument(
      <ConfigurationDiffBar />
    );
    expect(TestUtils.isCompositeComponent(diffBar)).toBeTruthy();
  });
})
