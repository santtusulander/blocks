import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../url-list.jsx')
const URLList = require('../url-list.jsx')

describe('URLList', () => {
  it('should exist', () => {
    let urlList = TestUtils.renderIntoDocument(
      <URLList />
    );
    expect(TestUtils.isCompositeComponent(urlList)).toBeTruthy();
  });
})
