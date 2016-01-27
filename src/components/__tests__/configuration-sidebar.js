import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../configuration-sidebar.jsx')
const ConfigurationSidebar = require('../configuration-sidebar.jsx')

describe('ConfigurationSidebar', () => {
  it('should exist', () => {
    let configurationSidebar = TestUtils.renderIntoDocument(
      <ConfigurationSidebar />
    );
    expect(TestUtils.isCompositeComponent(configurationSidebar)).toBeTruthy();
  });
})
