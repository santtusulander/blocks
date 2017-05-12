import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../stacked-by-time.jsx')
jest.unmock('moment-timezone')
jest.unmock('numeral')

import AnalysisStackedByTime from '../stacked-by-time'

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
    const wrapper = shallow(
      <AnalysisStackedByTime />
    )
    expect(wrapper.length).toBe(1);
  });

  it('can be passed a custom css class', () => {
    const wrapper = shallow(
      <AnalysisStackedByTime className="foo" width={400} height={200} padding={10}
        dataSets={fakeData}/>
    )
    expect(wrapper.hasClass('foo')).toBeTruthy();
  });

  it('should show loading message if there is no width or data', () => {
    const wrapper = shallow(
      <AnalysisStackedByTime/>
    )
    expect(wrapper.find({id: 'portal.loading.text'}).length).toBe(1)
  });

  it('should have data lines', () => {
    const wrapper = shallow(
      <AnalysisStackedByTime width={400} height={200} padding={10} dataSets={fakeData}/>
    )
    const lines = wrapper.find('line')
    expect(lines.length).toBe(4);
  });

  it('should have an x axis', () => {
    const wrapper = shallow(
      <AnalysisStackedByTime width={400} height={200} padding={10} dataSets={fakeData}/>
    )
    const texts = wrapper.find('text')
    const first = Number(texts.first().text())
    expect(first).toBeGreaterThan(400)
  });
});
