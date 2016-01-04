import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../edge.jsx')
const Edge = require('../edge.jsx')

describe('Edge', () => {
  it('should exist', () => {
    let edge = TestUtils.renderIntoDocument(
      <Edge />
    );
    expect(TestUtils.isCompositeComponent(edge)).toBeTruthy();
  });
})
