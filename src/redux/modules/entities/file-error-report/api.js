import axios from 'axios'

import { analyticsBase, qsBuilder } from '../../../util'

const URL = (params) => {
  //TODO UDNP-2958 Remove trailing slash for endpoint
  return `${analyticsBase()}/file-errors${qsBuilder(params)}`
}

export const fetchAll = urlParams =>
  axios.get(URL(urlParams)).then(({ data }) => {

    //Mimic normalizr's return pattern to use our receive entity-reducer
    return { entities: { fileErrorMetrics: data.data } }
  })
