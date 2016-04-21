import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../url-report.jsx')
const AnalysisURLReport = require('../url-report.jsx')

// Set up mocks to make sure formatting libs are used correctly
const numeral = require('numeral')
const numeralFormatMock = jest.genMockFunction()
numeral.mockReturnValue({format:numeralFormatMock})

describe('AnalysisURLReport', () => {
  it('should exist', () => {
    let urlReport = TestUtils.renderIntoDocument(
      <AnalysisURLReport fetching={true}/>
    );
    expect(TestUtils.isCompositeComponent(urlReport)).toBeTruthy();
  });
})
