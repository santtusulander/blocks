import React from 'react';
import TestUtils from 'react-addons-test-utils'

jest.unmock('../truncated-title.jsx');
import TruncatedTitle from '../truncated-title.jsx'

describe('TruncatedTitle', function() {
  it('should exist', () => {
    let truncatedTitle = TestUtils.renderIntoDocument(
      <TruncatedTitle content='UDN Admin' />
    );
    expect(TestUtils.isCompositeComponent(truncatedTitle)).toBeTruthy();
  });
});
