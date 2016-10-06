import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../playback-demo.jsx')
const PlaybackDemo = require('../playback-demo.jsx')

describe('PlaybackDemo', () => {
  it('should exist', () => {
    let demo = TestUtils.renderIntoDocument(
      <PlaybackDemo />
    );
    expect(TestUtils.isCompositeComponent(demo)).toBeTruthy();
  });
})
