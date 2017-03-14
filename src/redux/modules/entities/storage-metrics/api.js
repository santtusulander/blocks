import axios from 'axios'

import { analyticsBase, qsBuilder } from '../../../util'

const URL = (params, getOverView = true) => {
  //TODO UDNP-2958 Remove trailing slash for endpoint
  return `${analyticsBase({ legacy: false })}/storage/${getOverView ? 'get-overview/' : 'get-by-region/'}${qsBuilder(params)}`
}

//TODO: return actual response data when API returns a similar data set than this placeholder
export const fetch = (urlParams) =>
  axios.get(URL(urlParams)).then(() => {
    return {
      storageMetrics: [
        {
          "account_id":239,
          "group_id":340,
          "ingest_point_id":"music",
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
          detail: [
            {"files_count":26977,"bytes":3075897792836,"epoch_start":1489302000},
            {"files_count":59336,"bytes":3404762206454,"epoch_start":1489284000}
          ]
        }
      ]
    }
  })
