import React from 'react'
import { shallow } from 'enzyme'
import '../../../../__mocks__/recharts'
jest.mock('../../../util/helpers', () => {
  return{
    formatBitsPerSecond: bits_per_second => bits_per_second,
    unixTimestampToDate: timestamp => timestamp
  }
})

jest.unmock('../stacked-area-chart')
import StackedAreaChart from '../stacked-area-chart'

const chartData = [
  {
    "timestamp": 1486296000,
    "http": 2867790975,
    "actualTime": 1483617600,
    "https": 1257783590,
    "comparison_http": 2940013455,
    "comparison_https": 1421673284
  },
  {
    "timestamp": 1486299600,
    "http": 3040569602,
    "actualTime": 1483621200,
    "https": 1430006650,
    "comparison_http": 3208348144,
    "comparison_https": 1516673601
  },
  {
    "timestamp": 1486303200,
    "http": 3034458610,
    "actualTime": 1483624800,
    "https": 1377784173,
    "comparison_http": 3766128491,
    "comparison_https": 1805008399
  },
  {
    "timestamp": 1486306800,
    "http": 3240015008,
    "actualTime": 1483628400,
    "https": 1543896061,
    "comparison_http": 3683905892,
    "comparison_https": 1767230519
  },
  {
    "timestamp": 1486310400,
    "http": 3548905294,
    "actualTime": 1483632000,
    "https": 1701118904,
    "comparison_http": 4011129469,
    "comparison_https": 1912230957
  }
]

const areas = [
  {
    "dataKey": "comparison_http",
    "name": "Comparison HTTP",
    "className": "comparison_http",
    "stackId": 2
  },
  {
    "dataKey": "comparison_https",
    "name": "Comparison HTTPS",
    "className": "comparison_https",
    "stackId": 2
  },
  {
    "dataKey": "http",
    "name": "HTTP",
    "className": "http",
    "stackId": 1
  },
  {
    "dataKey": "https",
    "name": "HTTPS",
    "className": "https",
    "stackId": 1
  }
]

const subject = () => shallow(
  <StackedAreaChart
    areas={areas}
    chartLabel="Oct 2016 Month To Date"
    data={chartData}
  />
)

describe('StackedAreaChart', () => {
  it('should exist', () => {
    expect(subject()).toBeDefined()
  });
})
