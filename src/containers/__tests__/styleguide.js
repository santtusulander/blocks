import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../styleguide.jsx')
const Styleguide = require('../styleguide.jsx')

describe('Styleguide', () => {
  it('should exist', () => {
    let styleguide = TestUtils.renderIntoDocument(
      <Styleguide />
    );
    expect(TestUtils.isCompositeComponent(styleguide)).toBeTruthy();
  });
})
