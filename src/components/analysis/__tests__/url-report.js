import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.dontMock('../url-report.jsx')
const AnalysisURLReport = require('../url-report.jsx')

// Set up mocks to make sure formatting libs are used correctly
const numeral = require('numeral')
const numeralFormatMock = jest.genMockFunction()
numeral.mockReturnValue({format:numeralFormatMock})

const fakeData = Immutable.fromJS([
  {
    url: 'www.abc.com',
    bytes: 1000,
    requests: 287536
  },
  {
    url: 'www.cdg.com/123.mp4',
    bytes: 3000,
    requests: 343456
  }
])

describe('AnalysisURLReport', () => {
  it('should exist', () => {
    const urlReport = TestUtils.renderIntoDocument(
      <AnalysisURLReport/>
    );
    expect(TestUtils.isCompositeComponent(urlReport)).toBeTruthy();
  })
  it('should show urls in the table', () => {
    numeralFormatMock.mockClear()
    const urlReport = TestUtils.renderIntoDocument(
      <AnalysisURLReport urls={fakeData}/>
    );
    const trs = TestUtils.scryRenderedDOMComponentsWithTag(urlReport, 'tr')
    expect(trs.length).toBe(3)
    const tds = trs[1].getElementsByTagName('td')
    expect(tds[0].textContent).toContain('www.abc.com')
    expect(numeralFormatMock.mock.calls.length).toBe(4)
  })
})
