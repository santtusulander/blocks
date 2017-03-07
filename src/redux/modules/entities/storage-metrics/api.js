import axios from 'axios'
import { normalize, schema } from 'normalizr'

import { analyticsBase, buildReduxId, qsBuilder } from '../../../util'

const getURL = (params, getOverView = true) => {
  return `${analyticsBase({ legacy: false })}/storage/${getOverView ? 'get-overview' : 'get-by-region'}${qsBuilder(params)}`
}

const storageMetricsSchema = new schema.Entity('storageMetrics',
  {},
  { idAttribute: ({ group, ingest_point }) => buildReduxId(group, ingest_point) }
)

const storageComparisonMetricsSchema = new schema.Entity('storageMetrics',
  {},
  { idAttribute: ({ group, ingest_point }) => buildReduxId('comparison', group, ingest_point) }
)

export const fetch = (urlParams, comparison) =>
  axios.get(getURL(urlParams)).then(({ data }) => {
    return normalize(data.data, [ comparison ? storageComparisonMetricsSchema : storageMetricsSchema ])
  })
