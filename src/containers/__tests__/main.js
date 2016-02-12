import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.autoMockOff() // Uses react-bootstrap extensively, so don't auto mock

jest.dontMock('../main.jsx')
const Main = require('../main.jsx').Main

describe('Main', () => {
  it('should exist', () => {
    let main = TestUtils.renderIntoDocument(
      <Main routes={['foo']} />
    );
    expect(TestUtils.isCompositeComponent(main)).toBeTruthy();
  });
})
