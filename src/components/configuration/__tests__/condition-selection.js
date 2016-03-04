import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../condition-selection.jsx')
const ConditionSelection = require('../condition-selection.jsx')

describe('ConditionSelection', () => {
  it('should exist', () => {
    let cnditionSelection = TestUtils.renderIntoDocument(
      <ConditionSelection />
    );
    expect(TestUtils.isCompositeComponent(cnditionSelection)).toBeTruthy();
  });
});
