import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.dontMock('../url-report.jsx')
const AnalysisURLReport = require('../url-report.jsx')
const URLList = require('../url-list.jsx')
const HorizontalBar = require('../horizontal-bar.jsx')

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
  it('should show urls in the table', () => {
    const renderer = TestUtils.createRenderer()
    renderer.render(<AnalysisURLReport urls={fakeData}/>);
    const result = renderer.getRenderOutput()
    const urlList = result.props.children[2]
    expect(urlList.type).toEqual(URLList)
    expect(urlList.props.urls).toEqual(fakeData)
  })
  it('should show urls in the bar chart', () => {
    const renderer = TestUtils.createRenderer()
    renderer.render(<AnalysisURLReport urls={fakeData}/>);
    const result = renderer.getRenderOutput()
    const barChart = result.props.children[0].props.children
    expect(barChart.type).toEqual(HorizontalBar)
    expect(barChart.props.data).toEqual(fakeData.toJS())
  })
})
