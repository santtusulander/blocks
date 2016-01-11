import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../certificates.jsx')
const ConfigurationCertificates = require('../certificates.jsx')

describe('ConfigurationCertificates', () => {
  it('should exist', () => {
    let certificates = TestUtils.renderIntoDocument(
      <ConfigurationCertificates />
    );
    expect(TestUtils.isCompositeComponent(certificates)).toBeTruthy();
  });
})
