import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../home.jsx')
const Home = require('../home.jsx')

describe('Home', () => {
  it('should exist', () => {
    let home = TestUtils.renderIntoDocument(
      <Home />
    );
    expect(TestUtils.isCompositeComponent(home)).toBeTruthy();
  });
})
