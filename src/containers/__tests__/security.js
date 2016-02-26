import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../security.jsx')
const Security = require('../security.jsx')

describe('Security', () => {
  it('should exist', () => {
    let security = TestUtils.renderIntoDocument(
      <Security />
    );
    expect(TestUtils.isCompositeComponent(security)).toBeTruthy();
  });
})
