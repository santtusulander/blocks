import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../edit-account.jsx')
const EditAccount = require('../edit-account.jsx')

describe('EditAccount', () => {
  it('should exist', () => {
    let editAccount = TestUtils.renderIntoDocument(
      <EditAccount account={Immutable.Map()}/>
    );
    expect(TestUtils.isCompositeComponent(editAccount)).toBeTruthy();
  });
})
