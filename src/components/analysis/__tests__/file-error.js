import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../file-error.jsx')
const FileError = require('../file-error.jsx')

// Set up mocks to make sure formatting libs are used correctly
const numeral = require('numeral')
const numeralFormatMock = jest.genMockFunction()
numeral.mockReturnValue({format:numeralFormatMock})

describe('FileError', () => {
  it('should exist', () => {
    let fileError = TestUtils.renderIntoDocument(
      <FileError fetching={true}/>
    );
    expect(TestUtils.isCompositeComponent(fileError)).toBeTruthy();
  });
})
