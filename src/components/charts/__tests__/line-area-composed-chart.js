import React from 'react'
import { shallow } from 'enzyme'
import '../../../../__mocks__/recharts'
jest.mock('../../../util/helpers', () => {
  return{
    formatBitsPerSecond: bits_per_second => bits_per_second,
    unixTimestampToDate: timestamp => timestamp
  }
})

jest.unmock('../line-area-composed-chart')
import LineAreaComposedChart from '../line-area-composed-chart'

const chartData = [
  {
    "timestamp": 1486674000,
    "storage": 4293353131,
    "comparison_storage": 3920573638,
    "estimate": 2796679673
  },
  {
    "timestamp": 1486677600,
    "storage": 4124463309,
    "comparison_storage": 3732794940,
    "estimate": 2796679673
  },
  {
    "timestamp": 1486681200,
    "storage": 3939462700,
    "comparison_storage": 3616127919,
    "estimate": 2796679673
  }
]

const subject = () => shallow(
  <LineAreaComposedChart
    chartLabel="Oct 2016 Month To Date"
    data={chartData}
  />
)

describe('LineAreaComposedChart', () => {
  it('should exist', () => {
    expect(subject()).toBeDefined()
  });
})
