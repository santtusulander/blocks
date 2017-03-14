import axios from 'axios'
import { normalize, schema } from 'normalizr'

import { analyticsBase, buildReduxId, qsBuilder } from '../../../util'

const URL = (params, getOverView = true) => {
  //TODO UDNP-2958 Remove trailing slash for endpoint
  return `${analyticsBase({ legacy: false })}/storage/${getOverView ? 'get-overview/' : 'get-by-region/'}${qsBuilder(params)}`
}

/**
 * Normalization schema for metrics data
 * @type {schema}
 */
const storageMetricsSchema = new schema.Entity('storageMetrics',
  {},
  { idAttribute: ({ group, ingest_point }) => buildReduxId(group, ingest_point) }
)

export const fetch = (urlParams) =>
  axios.get(URL(urlParams)).then(({ data }) => {
    return normalize(data.data, [ storageMetricsSchema ])
  })
