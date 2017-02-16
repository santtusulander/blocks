import React from 'react'
import { shallow } from 'enzyme'
import '../../../../__mocks__/recharts'

jest.unmock('../line-chart')
import LineChart from '../line-chart'

jest.mock('../../../util/helpers', () => ({ formatBitsPerSecond: bits_per_second => bits_per_second }))

const data = [
  {
    "bytes": 204500916350,
    "timestamp": 1486954800,
    "requests": 818,
    "bits_per_second": 454446481
  },
  {
    "bytes": 181250833509,
    "timestamp": 1486958400,
    "requests": 725,
    "bits_per_second": 402779630
  },
  {
    "bytes": 173250805647,
    "timestamp": 1486962000,
    "requests": 693,
    "bits_per_second": 385001790
  }
]

const subject = shallow(
  <LineChart
    payload={data}
    dataKey="bits_per_second"
    />
)

describe('Line Chart', () => {
  it('should exist', () => {
    expect(subject).toBeDefined()
  });
})
