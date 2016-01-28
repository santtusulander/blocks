import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../cache-rules.jsx')
const ConfigurationCacheRules = require('../cache-rules.jsx')

describe('ConfigurationCacheRules', () => {
  it('should exist', () => {
    let cacheRules = TestUtils.renderIntoDocument(
      <ConfigurationCacheRules />
    );
    expect(TestUtils.isCompositeComponent(cacheRules)).toBeTruthy();
  });
})
