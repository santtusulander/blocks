import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.autoMockOff() // Uses react-bootstrap extensively, so don't auto mock

const Edge = require('../edge.jsx').Edge

describe('Edge', () => {
  it('should exist', () => {
    let edge = TestUtils.renderIntoDocument(
      <Edge />
    );
    expect(TestUtils.isCompositeComponent(edge)).toBeTruthy();
  });
})
