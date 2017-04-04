/*TODO: UDNP-2873 remove lint disable */
/*eslint-disable no-unused-vars */
import axios from 'axios'
import {normalize, schema} from 'normalizr'

import { BASE_URL_AAA, PAGINATION_MOCK } from '../../../util'

const baseUrl = (id) => {
  return `${BASE_URL_AAA}/roles`
}

const roleNameSchema = new schema.Entity('roleNames', {}, {})

export const fetchAll = () => {
  return axios.get(baseUrl(), PAGINATION_MOCK)
  .then(({data}) => {
    return normalize(data.data, [roleNameSchema])
  })
}
