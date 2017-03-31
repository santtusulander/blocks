/*TODO: UDNP-2873 remove lint disable */
/*eslint-disable no-unused-vars */
import axios from 'axios'
import {normalize, schema} from 'normalizr'

import { BASE_URL_AAA, PAGINATION_MOCK } from '../../../util'

const baseUrl = (id) => {
  return `${BASE_URL_AAA}/roles/${id}/services`
}

const rolePermissionSchema = new schema.Entity('roles', {}, {
  processStrategy: (value, parent, key) => {

    //To provide compability with the old permissionMapping
    const reduced = value.services.reduce( (acc, val) => {
      acc[val.service.toLowerCase()] = val.permissions.resources
      return acc;
    }, {})

    return reduced
  }
})

export const fetch = ({id}) => {
  return axios.get(baseUrl(id), PAGINATION_MOCK)
  .then( ({data}) => {
    return normalize(
      {
        id,
        services: data.data
      }, rolePermissionSchema
    )

  })
}
