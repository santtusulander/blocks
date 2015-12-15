import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../header.jsx')
const Header = require('../header.jsx')

describe('Header', () => {
  it('should exist', () => {
    let header = TestUtils.renderIntoDocument(
      <Header />
    );
    expect(TestUtils.isCompositeComponent(header)).toBeTruthy();
  });
})
