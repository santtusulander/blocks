import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.unmock('../remove-vary.jsx')
import RemoveVary from '../remove-vary.jsx'

describe('Redirection', () => {
  it('should exist', () => {
    let removeVary = TestUtils.renderIntoDocument(
      <RemoveVary />
    );
    expect(TestUtils.isCompositeComponent(removeVary)).toBeTruthy();
  })
})
