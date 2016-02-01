import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../configurations.jsx')
const Configurations = require('../configurations.jsx').Configurations

describe('Configurations', () => {
  it('should exist', () => {
    let configurations = TestUtils.renderIntoDocument(
      <Configurations />
    );
    expect(TestUtils.isCompositeComponent(configurations)).toBeTruthy();
  });
})
