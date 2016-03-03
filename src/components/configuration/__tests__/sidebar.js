import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../sidebar.jsx')
const Sidebar = require('../sidebar.jsx')

describe('Sidebar', () => {
  it('should exist', () => {
    let sidebar = TestUtils.renderIntoDocument(
      <Sidebar />
    );
    expect(TestUtils.isCompositeComponent(sidebar)).toBeTruthy();
  });
});
