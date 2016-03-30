import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../matches-selection.jsx')
const MatchesSelection = require('../matches-selection.jsx')

describe('ConditionSelection', () => {
  it('should exist', () => {
    let matchesSelection = TestUtils.renderIntoDocument(
      <MatchesSelection />
    );
    expect(TestUtils.isCompositeComponent(matchesSelection)).toBeTruthy();
  });
});
