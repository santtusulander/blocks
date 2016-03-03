import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../remove-vary.jsx')
const RemoveVary = require('../remove-vary.jsx')

describe('Redirection', () => {
  it('should exist', () => {
    let removeVary = TestUtils.renderIntoDocument(
      <RemoveVary />
    );
    expect(TestUtils.isCompositeComponent(removeVary)).toBeTruthy();
  })
})
