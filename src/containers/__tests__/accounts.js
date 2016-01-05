import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../accounts.jsx')
const Accounts = require('../accounts.jsx')

describe('Accounts', () => {
  it('should exist', () => {
    let accounts = TestUtils.renderIntoDocument(
      <Accounts />
    );
    expect(TestUtils.isCompositeComponent(accounts)).toBeTruthy();
  });
})
