import React from 'react'
import ReactDOM from 'react-dom'
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

const fakeData = [
  {
    "bytes_out": 3265,
    "bytes_in": 34857,
    "timestamp": new Date("2016-01-01 00:00:00")
  },
  {
    "bytes_out": 4564,
    "bytes_in": 68745,
    "timestamp": new Date("2016-01-02 00:00:00")
  },
  {
    "bytes_out": 4566,
    "bytes_in": 67865,
    "timestamp": new Date("2016-01-03 00:00:00")
  },
  {
    "bytes_out": 3455,
    "bytes_in": 67422,
    "timestamp": new Date("2016-01-04 00:00:00")
  },
  {
    "bytes_out": 2345,
    "bytes_in": 67854,
    "timestamp": new Date("2016-01-05 00:00:00")
  }
]

describe('AnalysisByTime', () => {
  it('should exist', () => {
    let byTime = TestUtils.renderIntoDocument(
      <AnalysisByTime />
    );
    expect(TestUtils.isCompositeComponent(byTime)).toBeTruthy();
  });

  it('can be passed a custom css class', () => {
    let byTime = TestUtils.renderIntoDocument(
      <AnalysisByTime className="foo" width={400} height={200} padding={10}
        primaryData={fakeData}
        dataKey="bytes_out"/>
    );
    let div = TestUtils.findRenderedDOMComponentWithTag(byTime, 'div');
    expect(ReactDOM.findDOMNode(div).className).toContain('foo');
  });

  it('should show loading message if there is no width or data', () => {
    let byTime = TestUtils.renderIntoDocument(
      <AnalysisByTime />
    );
    let div = TestUtils.findRenderedDOMComponentWithTag(byTime, 'div')
    expect(div.textContent).toContain('Loading');
  });

  it('should deactivate tooltip', () => {
    let byTime = TestUtils.renderIntoDocument(
      <AnalysisByTime />
    );
    byTime.state.tooltipText = "foo"
    byTime.deactivateTooltip()
    expect(byTime.state.tooltipText).toBe(null);
  });

  it('should have a data line and area', () => {
    let byTime = TestUtils.renderIntoDocument(
      <AnalysisByTime width={400} height={200} padding={10}
        primaryData={fakeData}
        dataKey="bytes_out"/>
    );
    let paths = TestUtils.scryRenderedDOMComponentsWithTag(byTime, 'path')
    expect(paths.length).toBe(2);
  });

  it('should have an x axis', () => {
    moment.mockClear()
    momentFormatMock.mockClear()
    let byTime = TestUtils.renderIntoDocument(
      <AnalysisByTime width={400} height={200} padding={10} axes={true}
        primaryData={fakeData}
        dataKey="bytes_out"/>
    );
    let texts = TestUtils.scryRenderedDOMComponentsWithTag(byTime, 'text')
    expect(texts[0].getAttribute('x')).toBe('30')
    expect(texts[0].getAttribute('y')).toBe('190')
    expect(momentFormatMock.mock.calls[0][0]).toBe('D')
  });

  it('should have a y axis', () => {
    numeral.mockClear()
    numeralFormatMock.mockClear()
    let byTime = TestUtils.renderIntoDocument(
      <AnalysisByTime width={400} height={200} padding={10} axes={true}
        primaryData={fakeData}
        dataKey="bytes_out"/>
    );
    let texts = TestUtils.scryRenderedDOMComponentsWithTag(byTime, 'text')
    expect(texts[2].getAttribute('y')).toBe('190')
    expect(numeral.mock.calls.length).toBe(8)
    expect(numeral.mock.calls[0]).toEqual([1000])
    expect(numeralFormatMock.mock.calls[0][0]).toBe('0 a')
  });

  it('should have ability to turn axes off', () => {
    moment.mockClear()
    numeral.mockClear()
    let byTime = TestUtils.renderIntoDocument(
      <AnalysisByTime width={400} height={200} padding={10} axes={false}
        primaryData={fakeData}
        dataKey="bytes_out"/>
    );
    let texts = TestUtils.scryRenderedDOMComponentsWithTag(byTime, 'text')
    expect(texts.length).toBe(0)
    expect(moment.mock.calls.length).toBe(0)
    expect(numeral.mock.calls.length).toBe(0)
  });
})
