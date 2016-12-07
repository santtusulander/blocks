import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.unmock('../compression.jsx')
import Compression from '../compression.jsx'

describe('Compression', () => {
  it('should exist', () => {
    let compression = TestUtils.renderIntoDocument(
      <Compression />
    );
    expect(TestUtils.isCompositeComponent(compression)).toBeTruthy();
  })
})
