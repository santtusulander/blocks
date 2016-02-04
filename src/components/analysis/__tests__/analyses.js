import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.autoMockOff()
jest.dontMock('../analyses.jsx')
const Analyses = require('../analyses.jsx')

describe('ConfigurationVersions', () => {
  it('should exist', () => {
    let analyses = TestUtils.renderIntoDocument(
      <Analyses />
    );
    expect(TestUtils.isCompositeComponent(analyses)).toBeTruthy();
  });
})
