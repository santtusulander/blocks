import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.unmock('../sidebar.jsx')
import Sidebar from '../sidebar.jsx'

describe('Sidebar', () => {
  it('should exist', () => {
    let sidebar = TestUtils.renderIntoDocument(
      <Sidebar />
    );
    expect(TestUtils.isCompositeComponent(sidebar)).toBeTruthy();
  });
});
