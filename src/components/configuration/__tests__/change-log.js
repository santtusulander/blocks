import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../change-log.jsx')
const ConfigurationChangeLog = require('../change-log.jsx')

describe('ConfigurationChangeLog', () => {
  it('should exist', () => {
    let changeLog = TestUtils.renderIntoDocument(
      <ConfigurationChangeLog />
    );
    expect(TestUtils.isCompositeComponent(changeLog)).toBeTruthy();
  });
})
