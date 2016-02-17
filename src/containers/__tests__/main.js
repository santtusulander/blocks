import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../main.jsx')
const Main = require('../main.jsx').Main

function uiActionsMaker() {
  return {
    changeTheme: jest.genMockFunction()
  }
}

describe('Main', () => {
  it('should exist', () => {
    let main = TestUtils.renderIntoDocument(
      <Main routes={['foo']} uiActions={uiActionsMaker()} theme="dark" />
    );
    expect(TestUtils.isCompositeComponent(main)).toBeTruthy();
  });
})
