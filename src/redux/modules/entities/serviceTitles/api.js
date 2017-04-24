/*TODO: UDNP-2873 remove lint disable */
/*eslint-disable no-unused-vars */
import axios from 'axios'
import {normalize, schema} from 'normalizr'

import { BASE_URL_AAA, PAGINATION_MOCK } from '../../../util'

const baseUrl = (id) => {
  return `${BASE_URL_AAA}/services/${id}`
}

const serviceTitleSchema = new schema.Entity('serviceTitles', {}, {
  idAttribute: 'name'
})

export const fetch = ({id}) => {
  return axios.get(baseUrl(id), PAGINATION_MOCK)
  .then(({data}) => {
    return normalize(data, serviceTitleSchema)
  })
}
