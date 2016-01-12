import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.autoMockOff()
const Main = require('../main.jsx')

describe('Main', () => {
  it('should exist', () => {
    let main = TestUtils.renderIntoDocument(
      <Main />
    );
    expect(TestUtils.isCompositeComponent(main)).toBeTruthy();
  });
})
