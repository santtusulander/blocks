import React from 'react';
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../truncated-title.jsx');
const TruncatedTitle = require('../truncated-title.jsx');

describe('TruncatedTitle', function() {
  it('should exist', () => {
    let truncatedTitle = TestUtils.renderIntoDocument(
      <TruncatedTitle content='UDN Admin' />
    );
    expect(TestUtils.isCompositeComponent(truncatedTitle)).toBeTruthy();
  });
});
