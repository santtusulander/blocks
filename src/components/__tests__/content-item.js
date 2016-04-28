import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../content-item.jsx')
const ContentItem = require('../content-item.jsx')

describe('ContentItem', () => {
  it('should exist', () => {
    let contentItem = TestUtils.renderIntoDocument(
      <ContentItem/>
    );
    expect(TestUtils.isCompositeComponent(contentItem)).toBeTruthy();
  });
})
