import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../actions-selection.jsx')
const ActionsSelection = require('../actions-selection.jsx')

describe('ConditionSelection', () => {
  it('should exist', () => {
    let actionsSelection = TestUtils.renderIntoDocument(
      <ActionsSelection />
    );
    expect(TestUtils.isCompositeComponent(actionsSelection)).toBeTruthy();
  });
});
