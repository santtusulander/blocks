import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../performance.jsx')
const ConfigurationPerformance = require('../performance.jsx')

describe('ConfigurationPerformance', () => {
  it('should exist', () => {
    let performance = TestUtils.renderIntoDocument(
      <ConfigurationPerformance />
    );
    expect(TestUtils.isCompositeComponent(performance)).toBeTruthy();
  });
})
