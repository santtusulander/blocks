import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../../shared/tooltips/tooltip')
jest.unmock('../stacked-by-group.jsx')
import AnalysisStackedByGroup from '../stacked-by-group.jsx'

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
    let div = TestUtils.findRenderedDOMComponentWithClass(stacks, 'foo')
    expect(div).toBeDefined()
  })

  it('should show loading message if there is no width or data', () => {
    let stacks = shallow(
      <AnalysisStackedByGroup/>
    )
    expect(stacks.find({id: 'portal.loading.text'}).length).toBe(1)
  })

  it('should have data lines', () => {
    let stacks = TestUtils.renderIntoDocument(
      <AnalysisStackedByGroup width={400} height={200} padding={10} datasets={fakeData}/>
    )
    let lines = TestUtils.scryRenderedDOMComponentsWithTag(stacks, 'line')
    expect(lines.length).toBe(8)
  })

  it('should have group labels', () => {
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
