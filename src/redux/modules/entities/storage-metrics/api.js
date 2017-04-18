import axios from 'axios'

import { analyticsBase, qsBuilder } from '../../../util'

const URL = (params, getOverView = true) => {
  //TODO UDNP-2958 Remove trailing slash for endpoint
  return `${analyticsBase({ legacy: false })}/storage/${getOverView ? 'get-overview/' : 'get-by-region/'}${qsBuilder(params)}`
}

export const fetch = (urlParams) =>
  axios.get(URL(urlParams)).then(({ data }) => {
    return { storageMetrics: data.data }
  })

export const fetchByGroup = (groupId, urlParams) => {
  urlParams.group = groupId
  return axios.get(URL(urlParams)).then(({ data }) => {
    return data.data
  })
}
