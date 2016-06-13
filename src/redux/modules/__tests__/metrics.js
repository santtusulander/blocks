import { fromJS, is } from 'immutable'

jest.unmock('../metrics.js')
jest.unmock('moment')
import moment from 'moment'
import {
  fetchSuccess,
  fetchFailure,
  parseDatapointTraffic
} from '../metrics.js'

const expectedDataPoint = {
  avg_cache_hit_rate: 94,
  avg_ttfb: '13 ms',
  transfer_rates: {
    peak: '1.94 Mbps',
    average: '126.96 Kbps',
    lowest: '27.51 Kbps' },
  historical_variance:[
    { bytes: 50552191, timestamp: 1461607200 },
    { bytes: 28499240, timestamp: 1460552400 }
  ],
  historical_traffic:[
    {
      bytes: null,
      timestamp: moment(1458136800, 'X').toDate()
    },
    {
      bytes: null,
      timestamp: moment(1458133200, 'X').toDate()
    }
  ],
  traffic:[
    {
      bits_per_second: null,
      bytes: null,
      timestamp: moment(1465858800, 'X').toDate()
    }
  ],
  totalTraffic: 0
}

describe('Metrics Module', () => {
  let emptyState = null
  let fakeMetrics = null
  beforeEach(() => {
    fakeMetrics = [
      {
        "avg_cache_hit_rate": 94,
        "avg_ttfb": "13 ms",
        "transfer_rates": {
          "peak": "1.94 Mbps",
          "average": "126.96 Kbps",
          "lowest": "27.51 Kbps"
        },
        "historical_variance": [
          {
            "bytes": 50552191,
            "timestamp": 1461607200
          },
          {
            "bytes": 28499240,
            "timestamp": 1460552400
          }
        ],
        "historical_traffic": [
          {
            "bytes": null,
            "timestamp": 1458136800
          },
          {
            "bytes": null,
            "timestamp": 1458133200
          }
        ],
        traffic: [
          {
            bits_per_second: null,
            bytes: null,
            timestamp: 1465858800
          }
        ]
      }
    ]
    emptyState = fromJS({
      accountMetrics: [],
      fetchingAccountMetrics: true
    })
  })
  it('should handle fetch success', () => {
    const newState = fetchSuccess('fetchingAccountMetrics', 'accountMetrics', emptyState, { payload: { data: fakeMetrics } })
    const expectedState = fromJS({
      fetchingAccountMetrics: false,
      accountMetrics: fakeMetrics
    })
    expect(is(newState, expectedState)).toBeTruthy();
  });
  it('should handle fetch failure', () => {
    const newState = fetchFailure('fetchingAccountMetrics', 'accountMetrics', emptyState)
    const expectedState = fromJS({
      fetchingAccountMetrics: false,
      accountMetrics: []
    })
    expect(is(newState, expectedState)).toBeTruthy();
  });
  it('should parse datapoint', () => {
    expect(is(fromJS(parseDatapointTraffic(fakeMetrics[0])), fromJS(expectedDataPoint))).toBeTruthy()
  });
});
