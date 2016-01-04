import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../purge.jsx')
const Purge = require('../purge.jsx')

describe('Purge', () => {
  it('should exist', () => {
    let purge = TestUtils.renderIntoDocument(
      <Purge />
    );
    expect(TestUtils.isCompositeComponent(purge)).toBeTruthy();
  });
})
