/*TODO: UDNP-2873 remove lint disable */
/*eslint-disable no-unused-vars */
import axios from 'axios'
import {normalize, schema} from 'normalizr'

import { BASE_URL_AAA, PAGINATION_MOCK } from '../../../util'

const baseUrl = (id) => {
  return `${BASE_URL_AAA}/roles/${id}/services`
}

const userPermissionsSchema = new schema.Entity('userPermissions', {},{
  idAttribute: 'service'
})

export const fetch = ({id}) => {
  return axios.get(baseUrl(id), PAGINATION_MOCK)
  .then( ({data}) => {
    return normalize(data.data, [ userPermissionsSchema ])
  })
}
