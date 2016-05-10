import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../data-box.jsx')
const DataBox = require('../data-box.jsx')

describe('DataBox', () => {
  it('should exist', () => {
    let dataBox = TestUtils.renderIntoDocument(
      <DataBox />
    );
    expect(TestUtils.isCompositeComponent(dataBox)).toBeTruthy();
  });
})
