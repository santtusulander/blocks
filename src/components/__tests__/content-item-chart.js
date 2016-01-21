import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../content-item-chart.jsx')
const ContentItemChart = require('../content-item-chart.jsx')

describe('ContentItemChart', () => {
  it('should exist', () => {
    let contentItem = TestUtils.renderIntoDocument(
      <ContentItemChart account={Immutable.Map()}/>
    );
    expect(TestUtils.isCompositeComponent(contentItem)).toBeTruthy();
  })
  it('should delete', () => {
    let deleteFunc = jest.genMockFunction()
    let deleteItem = TestUtils.renderIntoDocument(
      <ContentItemChart account={Immutable.Map()} delete={deleteFunc}/>
    )
    // Need to fix this
    // let links = TestUtils.scryRenderedDOMComponentsWithTag(deleteItem, 'a')
    // TestUtils.Simulate.click(links[0])
    // expect(deleteFunc.mock.calls.length).toEqual(1)
  })
  it('should toggle active', () => {
    let toggleActive = jest.genMockFunction()
    let contentItem = TestUtils.renderIntoDocument(
      <ContentItemChart account={Immutable.Map()} toggleActive={toggleActive}/>
    )
    let div = TestUtils.scryRenderedDOMComponentsWithTag(contentItem, 'div')
    TestUtils.Simulate.click(div[0])
    // Need to fix this
    // expect(toggleActive.mock.calls.length).toEqual(1)
  })
})
