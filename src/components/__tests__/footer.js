import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../footer.jsx')
const Footer = require('../footer.jsx')

describe('Footer', () => {
  it('should exist', () => {
    let footer = TestUtils.renderIntoDocument(
      <Footer />
    );
    expect(TestUtils.isCompositeComponent(footer)).toBeTruthy();
  });
})
