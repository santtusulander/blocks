import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../horizontal-bar.jsx')
import AnalysisHorizontalBar from '../horizontal-bar.jsx'

const props = {
  className: "",
  data: [],
  dataKey: "key",
  height: 100,
  labelKey: "labelKey",
  padding: 12,
  width: 300,
  xAxisCustomFormat: jest.fn(),
  xAxisFormat: '0'
}

describe('AnalysisHorizontalBar', () => {
  it('should exist', () => {
    let chart = shallow(
      <AnalysisHorizontalBar fetching={true}/>
    )

    expect(chart).toBeTruthy();
  })

  it('should render with all props', () => {
    let chart = shallow(
      <AnalysisHorizontalBar fetching={true} {...props} />
    )

    expect(chart).toBeTruthy();
  })

  it('should show LoadingSpinner if no width configured', () => {
    let chart = shallow(
      <AnalysisHorizontalBar fetching={true} {...props} width={0} />
    )

    expect(chart.find('LoadingSpinner').length).toBeTruthy();
  })

  it('should show not LoadingSpinner if there is width configured', () => {
    let chart = shallow(
      <AnalysisHorizontalBar fetching={true} data={[1,3,4]} {...props} />
    )

    expect(chart.find('LoadingSpinner').length).toBeFalsy();
  })

  it('should reflect className', () => {
    let chart = shallow(
      <AnalysisHorizontalBar fetching={true} {...props} className={"testtest"}/>
    )

    expect(chart.find('testtest').length).toBeFalsy();
  })
})
