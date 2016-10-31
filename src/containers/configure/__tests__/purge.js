import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.unmock('../purge.jsx')
import Purge from '../purge.jsx'

describe('Purge', () => {
  it('should exist', () => {
    let purge = TestUtils.renderIntoDocument(
      <Purge />
    );
    expect(TestUtils.isCompositeComponent(purge)).toBeTruthy();
  });
})
