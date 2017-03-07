import axios from 'axios'
import { normalize, schema } from 'normalizr'

import { analyticsBase, buildReduxId, qsBuilder } from '../../../util'

const URL = (params, getOverView = true) => {
  return `${analyticsBase({ legacy: false })}/storage/${getOverView ? 'get-overview' : 'get-by-region'}${qsBuilder(params)}`
}

/**
 * Normalization schema for metrics data
 * @type {schema}
 */
const storageMetricsSchema = new schema.Entity('storageMetrics',
  {},
  { idAttribute: ({ group, ingest_point }) => buildReduxId(group, ingest_point) }
)

/**
 * Normalization schema for comparison metrics data. Injects the word 'comparison' to each data block's redux ID.
 * @type {schema}
 */
const storageComparisonMetricsSchema = new schema.Entity('storageMetrics',
  {},
  { idAttribute: ({ group, ingest_point }) => buildReduxId('comparison', group, ingest_point) }
)

export const fetch = (urlParams, comparison) =>
  axios.get(URL(urlParams)).then(({ data }) => {
    return normalize(data.data, [ comparison ? storageComparisonMetricsSchema : storageMetricsSchema ])
  })
