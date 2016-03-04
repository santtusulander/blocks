import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../condition-selection.jsx')
const ConditionSelection = require('../condition-selection.jsx')

describe('ConditionSelection', () => {
  it('should exist', () => {
    let conditionSelection = TestUtils.renderIntoDocument(
      <ConditionSelection />
    );
    expect(TestUtils.isCompositeComponent(conditionSelection)).toBeTruthy();
  });
});
