import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.dontMock('../stacked-by-group.jsx')
const AnalysisStackedByGroup = require('../stacked-by-group.jsx')

// Set up mocks to make sure formatting libs are used correctly
const moment = require('moment')
const numeral = require('numeral')

const momentFormatMock = jest.genMockFunction().mockReturnValue('time')
const numeralFormatMock = jest.genMockFunction().mockReturnValue('number')

moment.mockReturnValue({format:momentFormatMock})
numeral.mockReturnValue({format:numeralFormatMock})

const fakeData = Immutable.fromJS([
  {
    group: "aaa",
    groupIndex: 0,
    data: [1, 2, 3, 4]
  },
  {
    group: "bbb",
    groupIndex: 0,
    data: [5, 6, 7, 8]
  }
])

describe('AnalysisStackedByGroup', () => {
  it('should exist', () => {
    let stacks = TestUtils.renderIntoDocument(
      <AnalysisStackedByGroup />
    )
    expect(TestUtils.isCompositeComponent(stacks)).toBeTruthy()
  })

  it('can be passed a custom css class', () => {
    let stacks = TestUtils.renderIntoDocument(
      <AnalysisStackedByGroup className="foo" width={400} height={200} padding={10}
        datasets={fakeData}/>
    )
    let div = TestUtils.findRenderedDOMComponentWithTag(stacks, 'div')
    expect(ReactDOM.findDOMNode(div).className).toContain('foo')
  })

  it('should show loading message if there is no width or data', () => {
    let stacks = TestUtils.renderIntoDocument(
      <AnalysisStackedByGroup/>
    )
    let div = TestUtils.findRenderedDOMComponentWithTag(stacks, 'div')
    expect(div.textContent).toContain('Loading')
  })

  it('should deactivate tooltip', () => {
    let stacks = TestUtils.renderIntoDocument(
      <AnalysisStackedByGroup />
    )
    stacks.state.tooltipText = "foo"
    stacks.deactivateTooltip()
    expect(stacks.state.tooltipText).toBe(null)
  })

  it('should have data lines', () => {
    let stacks = TestUtils.renderIntoDocument(
      <AnalysisStackedByGroup width={400} height={200} padding={10} datasets={fakeData}/>
    )
    let lines = TestUtils.scryRenderedDOMComponentsWithTag(stacks, 'line')
    expect(lines.length).toBe(8)
  })

  it('should have group labels', () => {
    moment.mockClear()
    momentFormatMock.mockClear()
    let stacks = TestUtils.renderIntoDocument(
      <AnalysisStackedByGroup width={400} height={200} padding={10} datasets={fakeData}/>
    )
    let texts = TestUtils.scryRenderedDOMComponentsWithTag(stacks, 'text')
    expect(texts[0].getAttribute('y')).toBe('190')
    expect(texts[0].textContent).toBe('aaa')
    expect(texts[1].textContent).toBe('bbb')
  })

  it('should have a y axis', () => {
    let stacks = TestUtils.renderIntoDocument(
      <AnalysisStackedByGroup width={400} height={200} padding={10} datasets={fakeData}/>
    )
    let texts = TestUtils.scryRenderedDOMComponentsWithTag(stacks, 'text')
    expect(texts.length).toBe(8)
  })

  it('should show a chart label', () => {
    let stacks = TestUtils.renderIntoDocument(
      <AnalysisStackedByGroup width={400} height={200} padding={10}
        datasets={fakeData} chartLabel="test label"/>
    )
    let label = TestUtils.findRenderedDOMComponentWithClass(stacks, 'chart-label')
    expect(label.textContent).toBe('test label')
  })

  it('should have dataset labels', () => {
    let stacks = TestUtils.renderIntoDocument(
      <AnalysisStackedByGroup width={400} height={200} padding={10}
        datasets={fakeData} datasetLabels={[1,2,3,4]}/>
    )
    let label = TestUtils.findRenderedDOMComponentWithClass(stacks, 'dataset-labels')
    expect(label.textContent).toContain('1')
    expect(label.textContent).toContain('2')
    expect(label.textContent).toContain('3')
    expect(label.textContent).toContain('4')
  })
});
