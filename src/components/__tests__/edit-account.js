import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../edit-account.jsx')
const EditAccount = require('../edit-account.jsx')

describe('EditAccount', () => {
  it('should exist', () => {
    let editAccount = TestUtils.renderIntoDocument(
      <EditAccount />
    );
    expect(TestUtils.isCompositeComponent(editAccount)).toBeTruthy();
  });
})
