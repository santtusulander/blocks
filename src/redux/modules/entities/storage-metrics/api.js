import axios from 'axios'

import { analyticsBase, qsBuilder } from '../../../util'

const URL = (params, getOverView = true) => {
  //TODO UDNP-2958 Remove trailing slash for endpoint
  return `${analyticsBase({ legacy: false })}/storage/${getOverView ? 'get-overview/' : 'get-by-region/'}${qsBuilder(params)}`
}

export const fetch = (urlParams, metricsKey) =>
  axios.get(URL(urlParams)).then(({ data }) => {

    //Mimic normalizr's return pattern to use our receive entity-reducer
    return { entities: { storageMetrics: { [metricsKey]: data.data } } }
  })
