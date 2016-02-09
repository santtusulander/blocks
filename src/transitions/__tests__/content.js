import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.autoMockOff()
const ContentTransition = require('../content.jsx')

describe('ContentTransition', () => {
  it('should exist', () => {
    let content = TestUtils.renderIntoDocument(
      <ContentTransition location={{pathname: 'path'}}><div /></ContentTransition>
    );
    expect(TestUtils.isCompositeComponent(content)).toBeTruthy();
  })
})
