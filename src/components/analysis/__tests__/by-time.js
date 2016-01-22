import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../by-time.jsx')
const AnalysisByTime = require('../by-time.jsx')

// Set up mocks to make sure formatting libs are used correctly
const moment = require('moment')
const numeral = require('numeral')

const momentFormatMock = jest.genMockFunction()
const numeralFormatMock = jest.genMockFunction()

moment.mockReturnValue({format:momentFormatMock})
numeral.mockReturnValue({format:numeralFormatMock})

const fakePrimaryData = [
  {epoch_start: 1451606400, bytes: 3, requests: 1},
  {epoch_start: 1451606500, bytes: 2, requests: 2},
  {epoch_start: 1451606600, bytes: 1, requests: 3}
]
const fakeSecondaryData = [
  {epoch_start: 1451606400, bytes: 6, requests: 4},
  {epoch_start: 1451606500, bytes: 5, requests: 5},
  {epoch_start: 1451606600, bytes: 4, requests: 6}
]

describe('AnalysisByTime', () => {
  it('should exist', () => {
    let byTime = TestUtils.renderIntoDocument(
      <AnalysisByTime />
    );
    expect(TestUtils.isCompositeComponent(byTime)).toBeTruthy();
  });

  it('should show loading message if there is no width or data', () => {
    let byTime = TestUtils.renderIntoDocument(
      <AnalysisByTime />
    );
    let div = TestUtils.findRenderedDOMComponentWithTag(byTime, 'div')
    expect(div.textContent).toContain('Loading');
  });

  it('should have primary and secondary paths', () => {
    let byTime = TestUtils.renderIntoDocument(
      <AnalysisByTime width={400} height={200} padding={10}
        primaryData={fakePrimaryData} secondaryData={fakeSecondaryData}/>
    );
    let paths = TestUtils.scryRenderedDOMComponentsWithTag(byTime, 'path')
    expect(paths.length).toBe(2);
  });

  it('should have an x axis', () => {
    moment.mockClear()
    momentFormatMock.mockClear()
    let byTime = TestUtils.renderIntoDocument(
      <AnalysisByTime width={400} height={200} padding={10} axes={true}
        primaryData={fakePrimaryData} secondaryData={fakeSecondaryData}/>
    );
    let texts = TestUtils.scryRenderedDOMComponentsWithTag(byTime, 'text')
    expect(texts[0].getAttribute('x')).toBe('20')
    expect(texts[0].getAttribute('y')).toBe('190')
    expect(moment.mock.calls.length).toEqual(4)
    expect(moment.mock.calls[0]).toEqual([1451606400, 'X'])
    expect(momentFormatMock.mock.calls[0][0]).toBe('MMM D')
  });

  it('should have a y axis', () => {
    numeral.mockClear()
    numeralFormatMock.mockClear()
    let byTime = TestUtils.renderIntoDocument(
      <AnalysisByTime width={400} height={200} padding={10} axes={true}
        primaryData={fakePrimaryData} secondaryData={fakeSecondaryData}/>
    );
    let texts = TestUtils.scryRenderedDOMComponentsWithTag(byTime, 'text')
    expect(texts[4].getAttribute('x')).toBe('10')
    expect(texts[4].getAttribute('y')).toBe('123.33333333333334')
    expect(numeral.mock.calls.length).toBe(3)
    expect(numeral.mock.calls[0]).toEqual([2])
    expect(numeralFormatMock.mock.calls[0][0]).toBe('0a')
  });

  it('should have ability to turn axes off', () => {
    moment.mockClear()
    numeral.mockClear()
    let byTime = TestUtils.renderIntoDocument(
      <AnalysisByTime width={400} height={200} padding={10} axes={false}
        primaryData={fakePrimaryData} secondaryData={fakeSecondaryData}/>
    );
    let texts = TestUtils.scryRenderedDOMComponentsWithTag(byTime, 'text')
    expect(texts.length).toBe(0)
    expect(moment.mock.calls.length).toBe(0)
    expect(numeral.mock.calls.length).toBe(0)
  });
})
