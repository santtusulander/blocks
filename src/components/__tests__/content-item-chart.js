import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../content-item-chart.jsx')
const ContentItemChart = require('../content-item-chart.jsx')

const fakePrimaryData = [
  {bytes: 25287},
  {bytes: 75693}]

const fakeSecondaryData = [
  {bytes: 25287},
  {bytes: 75693}]

describe('ContentItemChart', () => {
  it('should exist', () => {
    let contentItem = TestUtils.renderIntoDocument(
      <ContentItemChart account={Immutable.Map()}/>
    );
    expect(TestUtils.isCompositeComponent(contentItem)).toBeTruthy();
  })
  it('should toggle active', () => {
    let toggleActive = jest.genMockFunction()
    let contentItem = TestUtils.renderIntoDocument(
      <ContentItemChart account={Immutable.Map()} toggleActive={toggleActive}
        primaryData={fakePrimaryData} secondaryData={fakeSecondaryData}/>
    )
    let div = TestUtils.scryRenderedDOMComponentsWithClass(contentItem,
      'edit-content-item')
    TestUtils.Simulate.click(div[0])
    expect(toggleActive.mock.calls.length).toEqual(1)
  })
})
