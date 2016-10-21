import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.unmock('../post-support.jsx')
import PostSupport from '../post-support.jsx'

describe('PostSupport', () => {
  it('should exist', () => {
    let postSupport = TestUtils.renderIntoDocument(
      <PostSupport />
    );
    expect(TestUtils.isCompositeComponent(postSupport)).toBeTruthy();
  })
})
