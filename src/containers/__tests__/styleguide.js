import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.autoMockOff()
jest.unmock('../styleguide.jsx')
import Styleguide from '../styleguide.jsx'

describe('Styleguide', () => {
  it('should exist', () => {
    let styleguide = TestUtils.renderIntoDocument(
      <Styleguide />
    );
    expect(TestUtils.isCompositeComponent(styleguide)).toBeTruthy();
  });
})
