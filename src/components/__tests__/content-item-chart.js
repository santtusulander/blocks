import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'
import TestUtils from 'react-addons-test-utils'

jest.autoMockOff()
jest.dontMock('../content-item-chart.jsx')
const ContentItemChart = require('../content-item-chart.jsx')

const fakePrimaryData = Immutable.List([
  {bytes: 123, timestamp: 123},
  {bytes: 234, timestamp: 234},
  {bytes: 345, timestamp: 345}
])

const fakeSecondaryData = Immutable.List([
  {bytes: 234, timestamp: 234},
  {bytes: 345, timestamp: 345},
  {bytes: 456, timestamp: 456}
])

const fakeDifferenceData = Immutable.List([0, 0, 0, 1, 1, 1])

describe('ContentItemChart', () => {
  it('should exist', () => {
    let contentItem = TestUtils.renderIntoDocument(
      <ContentItemChart />
    );
    expect(TestUtils.isCompositeComponent(contentItem)).toBeTruthy();
  })

  it('should not show a loading message', () => {
    let contentItem = shallow(<ContentItemChart fetchingMetrics={true}/>)
    expect(contentItem.find('#fetchingMetrics').length).toBe(1)
  });

  it('should not show a loading message', () => {
    let contentItem = shallow(<ContentItemChart/>)
    expect(contentItem.find('#fetchingMetrics').length).toBe(0)
  });

  it('should show primary chart', () => {
    let contentItem = TestUtils.renderIntoDocument(
      <ContentItemChart
        primaryData={fakePrimaryData}
        secondaryData={fakeSecondaryData}
        differenceData={fakeDifferenceData}
        fetchingMetrics={false}
        linkTo='foo'
        analyticsLink='foo'
        configurationLink='foo'
        chartWidth='100'
        barMaxHeight='10' />
    )
    let primary = TestUtils.findRenderedDOMComponentWithClass(contentItem, 'primary-data')
    expect(primary).toBeTruthy();
  });

  it('should show primary chart', () => {
    let contentItem = TestUtils.renderIntoDocument(
      <ContentItemChart
        primaryData={fakePrimaryData}
        secondaryData={fakeSecondaryData}
        differenceData={fakeDifferenceData}
        fetchingMetrics={false}
        linkTo='foo'
        analyticsLink='foo'
        configurationLink='foo'
        chartWidth='100'
        barMaxHeight='10' />
    )
    let secondary = TestUtils.findRenderedDOMComponentWithClass(contentItem, 'secondary-data')
    expect(secondary).toBeTruthy();
  });

  it('should show difference arc', () => {
    let contentItem = TestUtils.renderIntoDocument(
      <ContentItemChart
        primaryData={fakePrimaryData}
        secondaryData={fakeSecondaryData}
        differenceData={fakeDifferenceData}
        fetchingMetrics={false}
        linkTo='foo'
        analyticsLink='foo'
        configurationLink='foo'
        chartWidth='100'
        barMaxHeight='10' />
    )
    let arc = TestUtils.findRenderedDOMComponentWithClass(contentItem, 'difference-arc')
    expect(arc).toBeTruthy();
  });

  it('should show difference arc legend on hover', () => {
    let contentItem = TestUtils.renderIntoDocument(
      <ContentItemChart
        primaryData={fakePrimaryData}
        secondaryData={fakeSecondaryData}
        differenceData={fakeDifferenceData}
        fetchingMetrics={false}
        linkTo='foo'
        analyticsLink='foo'
        configurationLink='foo'
        chartWidth='100'
        barMaxHeight='10' />
    )
    expect(contentItem.state.showDiffLegend).toBe(false)
    contentItem.differenceHover(true)()
    expect(contentItem.state.showDiffLegend).toBe(true)
  });
})
