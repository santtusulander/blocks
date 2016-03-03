import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../post-support.jsx')
const PostSupport = require('../post-support.jsx')

describe('PostSupport', () => {
  it('should exist', () => {
    let postSupport = TestUtils.renderIntoDocument(
      <PostSupport />
    );
    expect(TestUtils.isCompositeComponent(postSupport)).toBeTruthy();
  })
})
