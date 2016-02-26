import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../services.jsx')
const Services = require('../services.jsx')

describe('Services', () => {
  it('should exist', () => {
    let services = TestUtils.renderIntoDocument(
      <Services />
    );
    expect(TestUtils.isCompositeComponent(services)).toBeTruthy();
  });
})
