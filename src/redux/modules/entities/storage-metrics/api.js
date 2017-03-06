// import axios from 'axios'
import { normalize, schema } from 'normalizr'

import { /*BASE_URL_NORTH,*/ buildReduxId } from '../../../util'

const mockData = {
  status: "success",
  data: [{
    account: 20005,
    group: 268,
    ingest_point: 10,
    totals: {
      bytes: {
        ending: 108000497044939,
        peak: 71963080986145,
        low: 36037416058794,
        average: 54000248522470,
        percent_change: 50.00
      },
      historical_bytes: {
        ending: 108000497044939,
        peak: 71963080986145,
        low: 36037416058794,
        average: 54000248522470,
        percent_change: 50.00
      },
      file_count: {
        ending: 108000497044939,
        peak: 71963080986145,
        low: 36037416058794,
        average: 54000248522470,
        percent_change: 50.00
      },
      historical_file_count: {
        ending: 108000497044939,
        peak: 71963080986145,
        low: 36037416058794,
        average: 54000248522470,
        percent_change: 50.00
      }
    },
    details: {
      "cis-us-sjc-strg0": [{
        timestamp: 1465862400,
        bytes: 108000497044939,
        file_count: 5000,
        historical_bytes: 71963080986145,
        historical_file_count: 5000
      }],
      "cis-fi-sjc-strg1": [{
        timestamp: 1465862400,
        bytes: 108000497044939,
        file_count: 5000,
        historical_bytes: 71963080986145,
        historical_file_count: 5000
      }]
    }
  }]
}

const storageMetricsSchema = new schema.Entity('storageMetrics',
  {},
  { idAttribute: ({ group, ingest_point }) => buildReduxId(group, ingest_point) }
)

export const fetchAll = () => Promise.resolve(normalize(mockData.data, [ storageMetricsSchema ]))

export const fetch = () => Promise.resolve(normalize(mockData.data, [ storageMetricsSchema ]))
