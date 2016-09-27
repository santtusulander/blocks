import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

jest.autoMockOff()
jest.unmock('../stacked-by-time.jsx')
const AnalysisStackedByTime = require('../stacked-by-time.jsx')

// Set up mocks to make sure formatting libs are used correctly
jest.mock('numeral')
const numeral = require('numeral')
const numeralFormatMock = jest.fn(() => 'number')
numeral.mockReturnValue({ format: numeralFormatMock })

const fakeData = [
  [
    {
      "timestamp":new Date(1459468800*1000),
      "bytes":456
    },
    {
      "timestamp":new Date(1459555200*1000),
      "bytes":654
    }
  ],
  [
    {
      "timestamp":new Date(1459468800*1000),
      "bytes":789
    },
    {
      "timestamp":new Date(1459555200*1000),
      "bytes":321
    }
  ]
]

describe('AnalysisStackedByTime', () => {
  it('should exist', () => {
    let stacks = TestUtils.renderIntoDocument(
      <AnalysisStackedByTime />
    );
    expect(TestUtils.isCompositeComponent(stacks)).toBeTruthy();
  });

  it('can be passed a custom css class', () => {
    let stacks = TestUtils.renderIntoDocument(
      <AnalysisStackedByTime className="foo" width={400} height={200} padding={10}
        dataSets={fakeData}/>
    );
    let div = TestUtils.findRenderedDOMComponentWithTag(stacks, 'div');
    expect(ReactDOM.findDOMNode(div).className).toContain('foo');
  });

  it('should show loading message if there is no width or data', () => {
    let stacks = TestUtils.renderIntoDocument(
      <AnalysisStackedByTime/>
    );
    let div = TestUtils.findRenderedDOMComponentWithTag(stacks, 'div')
    expect(div.textContent).toContain('Loading');
  });

  it('should have data lines', () => {
    let stacks = TestUtils.renderIntoDocument(
      <AnalysisStackedByTime width={400} height={200} padding={10} dataSets={fakeData}/>
    );
    let lines = TestUtils.scryRenderedDOMComponentsWithTag(stacks, 'line')
    expect(lines.length).toBe(4);
  });

  it('should have an x axis', () => {
    let stacks = TestUtils.renderIntoDocument(
      <AnalysisStackedByTime width={400} height={200} padding={10} dataSets={fakeData}/>
    );
    let texts = TestUtils.scryRenderedDOMComponentsWithTag(stacks, 'text')
    expect(texts[0].getAttribute('x')).toBe('20')
    expect(texts[13].textContent).toBe('number')
  });

  it('should have a y axis', () => {
     numeral.mockClear()
     numeralFormatMock.mockClear()
    let stacks = TestUtils.renderIntoDocument(
      <AnalysisStackedByTime width={400} height={200} padding={10} dataSets={fakeData}/>
    );
    let texts = TestUtils.scryRenderedDOMComponentsWithTag(stacks, 'text')

    expect(texts[13].textContent).toBe('number')
    expect(numeral.mock.calls.length).toBe(2)
    expect(numeral.mock.calls[0]).toEqual([500])
    expect(numeralFormatMock.mock.calls[0][0]).toBe('0 a')
  });
});
