import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.autoMockOff()
const ContentTransition = require('../content.jsx')

describe('ContentTransition', () => {
  it('should exist', () => {
    let content = TestUtils.renderIntoDocument(
      <ContentTransition />
    );
    expect(TestUtils.isCompositeComponent(content)).toBeTruthy();
  })
})
