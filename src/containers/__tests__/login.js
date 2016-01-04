import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../login.jsx')
const Login = require('../login.jsx')

describe('Login', () => {
  it('should exist', () => {
    let login = TestUtils.renderIntoDocument(
      <Login />
    );
    expect(TestUtils.isCompositeComponent(login)).toBeTruthy();
  });
})
