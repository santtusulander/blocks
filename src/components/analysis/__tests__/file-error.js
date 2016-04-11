import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../file-error.jsx')
const FileError = require('../file-error.jsx')

describe('FileError', () => {
  it('should exist', () => {
    let fileError = TestUtils.renderIntoDocument(
      <FileError fetching={true}/>
    );
    expect(TestUtils.isCompositeComponent(fileError)).toBeTruthy();
  });
})
