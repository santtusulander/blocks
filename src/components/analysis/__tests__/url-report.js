import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../url-report.jsx')
const AnalysisURLReport = require('../url-report.jsx')

describe('AnalysisURLReport', () => {
  it('should exist', () => {
    let urlReport = TestUtils.renderIntoDocument(
      <AnalysisURLReport fetching={true}/>
    );
    expect(TestUtils.isCompositeComponent(urlReport)).toBeTruthy();
  });
})
