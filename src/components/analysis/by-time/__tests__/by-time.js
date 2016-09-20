import React from 'react'
import ReactDOM from 'react-dom'
//import TestUtils from 'react-addons-test-utils'
import {shallow, render, mount} from 'enzyme'
import jsdom from 'jsdom'

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.window = document.defaultView

jest.unmock('../by-time.jsx')
jest.unmock('../../../../util/helpers')
import {formatBytes} from '../../../../util/helpers'
import AnalysisByTime from '../by-time.jsx'

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

const LOADING_TEXT = 'Loading...'
const NO_DATA_FOUND_TEXT = 'No data found'

const datasets = [
  {
    area: false,
    color: '#00a9d4',
    comparisonData: false,
    data:[
      {
        bytes: 1,
        timestamp: 1474357953068
      },
      {
        bytes: 100,
        timestamp: 1474357953123
      }
    ],
    id: '',
    label: 'On Net',
    line: true,
    stackedAgainst: false,
    xAxisFormatter: false
  },
  {
    area: false,
    color: 'yellow',
    comparisonData: false,
    data:[
      {
        bytes: 1,
        timestamp: 1474357953068
      },
      {
        bytes: 100,
        timestamp: 1474357953123
      }
    ],
    id: '',
    label: 'Off Net',
    line: true,
    stackedAgainst: false,
    xAxisFormatter: false
  }
]

describe('AnalysisByTime', () => {

  let subject, props = null

  beforeEach(() => {
    subject = (props) => {
      let defaultProps = Object.assign({}, {
        axes: true,
        padding: 40,
        dataKey: 'bytes',
        dataSets: datasets,
        yAxisCustomFormat: (val, setMax) => formatBytes(val, false, setMax),
        width: 100,
        height: 100 / 3,
        showLegend: true,
        showTooltip: false
      }, props)
      return shallow(<AnalysisByTime {...defaultProps}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1);
  })

  it('should show loading message if there is no width or data', () => {
    let emptyAnalysis = shallow(<AnalysisByTime/>)
    expect(
      emptyAnalysis
        .find('div')
        .text()
    ).toContain(LOADING_TEXT)
  })

  it('can be passed a custom css class', () => {
    expect(
      subject({className: 'foo'})
        .find('.foo')
        .length
    ).toBe(1)
  })

  it('should deactivate tooltip', () => {

    let byTime = subject({showTooltip: true})

    byTime.state().tooltipText = ['foo', 'bar']
    byTime.instance().deactivateTooltip()

    expect(byTime.state().tooltipText).toEqual([]);
  })

  it('should have a data line and area', () => {
    expect(
      subject()
        .find('path')
        .length
    ).toBe(2);
  });

  it('should have an x axis', () => {
    moment.mockClear()
    momentFormatMock.mockClear()

    let texts = subject().find('text')

    expect(texts.first().prop('x')).toBeTruthy()
    expect(texts.first().prop('y')).toBeTruthy()
  });

  it('should have a y axis', () => {
    numeral.mockClear()
    numeralFormatMock.mockClear()

    let texts = subject().find('text')

    expect(texts.first().prop('x')).toBeTruthy()
    expect(texts.first().prop('y')).toBeTruthy()
    expect(numeral.mock.calls.length).toBe(15)
  })

  it('should have ability to turn axes off', () => {
    moment.mockClear()
    numeral.mockClear()
    let texts = subject({axes: false}).find('text')

    expect(texts.length).toBe(0)
    expect(moment.mock.calls.length).toBe(0)
    expect(numeral.mock.calls.length).toBe(0)
  })

  it('should show no data if the desired dataSet is empty', () => {
    expect(subject({ dataKey: 'bytes_out' }).text()).toContain(NO_DATA_FOUND_TEXT);
  })

  it('should have Legend', () => {
    expect(
      subject()
        .find('Legend')
        .length
    ).toBe(1);
  })
})
