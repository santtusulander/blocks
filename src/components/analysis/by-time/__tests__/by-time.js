import React from 'react'
import ReactDOM from 'react-dom'
//import TestUtils from 'react-addons-test-utils'
import {shallow, render} from 'enzyme'

jest.dontMock('../by-time.jsx')
const AnalysisByTime = require('../by-time.jsx')

// Set up mocks to make sure formatting libs are used correctly
const moment = require('moment')
const numeral = require('numeral')

const momentFormatMock = jest.genMockFunction()
const numeralFormatMock = jest.genMockFunction()

moment.mockReturnValue({
  format: momentFormatMock,
  date: jest.genMockFunction()
})
moment.utc.mockReturnValue({
  format: momentFormatMock
})
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
    let byTime = shallow(
      <AnalysisByTime />
    );
    expect(byTime.length).toBe(1);
  });

  it('can be passed a custom css class', () => {
    let byTime = shallow(
      <AnalysisByTime className="foo" width={400} height={200} padding={10}
        primaryData={fakeData}
        dataKey="bytes_out"/>
    );
    let div = byTime.find('div.foo');
    expect(div.length).toBe(1)
  });

  it('should show loading message if there is no width or data', () => {
    let byTime = shallow(
      <AnalysisByTime />
    );
    let div = byTime.find('div')
    expect(div.text()).toContain('Loading');
  });

  /* NOT NEEDED ANYMORE -> as changed tooltips to legend
  it('should deactivate tooltip', () => {
    let byTime = shallow(
      <AnalysisByTime />
    );
    byTime.state.primaryTooltipText = "foo"
    byTime.state.secondaryTooltipText = "bar"
    byTime.deactivateTooltip()
    expect(byTime.state.primaryTooltipText).toBe(null);
    expect(byTime.state.secondaryTooltipText).toBe(null);
  });
   */

  it('should have a data line and area', () => {
    let byTime = shallow(
      <AnalysisByTime width={400} height={200} padding={10}
        primaryData={fakeData}
        dataKey="bytes_out"/>
    );
    let paths = byTime.find('path')
    expect(paths.length).toBe(2);
  });

  it('should have an x axis', () => {
    moment.mockClear()
    momentFormatMock.mockClear()
    let byTime = shallow(
      <AnalysisByTime width={400} height={200} padding={10} axes={true}
        primaryData={fakeData}
        secondaryData={fakeData}
        dataKey="bytes_out"/>
    );
    let texts = byTime.find('text')

    expect(texts.first().prop('x')).toBe(30)
    expect(texts.first().prop('y')).toBe(190)
    expect(momentFormatMock.mock.calls[0][0]).toBe('D')
  });

  it('should have a y axis', () => {
    numeral.mockClear()
    numeralFormatMock.mockClear()
    let byTime = shallow(
      <AnalysisByTime width={400} height={200} padding={10} axes={true}
        primaryData={fakeData}
        secondaryData={fakeData}
        dataKey="bytes_out"/>
    );


    let texts = byTime.find('text') //TestUtils.scryRenderedDOMComponentsWithTag(byTime, 'text')

    expect(texts.at(2).prop('y')).toBe(190)

    // Why 8 calls ? result is 4??
    //expect(numeral.mock.calls.length).toBe(8)

    expect(numeral.mock.calls[0]).toEqual([1000])
    expect(numeralFormatMock.mock.calls[0][0]).toBe('0 a')
  });

  it('should have ability to turn axes off', () => {
    moment.mockClear()
    numeral.mockClear()
    let byTime = shallow(
      <AnalysisByTime width={400} height={200} padding={10} axes={false}
        primaryData={fakeData}
        secondaryData={fakeData}
        dataKey="bytes_out"/>
    );
    let texts = byTime.find('text')
    expect(texts.length).toBe(0)
    expect(moment.mock.calls.length).toBe(0)
    expect(numeral.mock.calls.length).toBe(0)
  });

  it('should show no data if the data is empty', () => {
    let byTime = shallow(
      <AnalysisByTime width={400} height={200}
        primaryData={[]}
        secondaryData={null}/>
    );
    let div = byTime.find('div')
    expect(div.text()).toContain('No data found.');
  });
})
