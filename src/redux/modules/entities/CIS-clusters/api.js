/*TODO: UDNP-2873 remove lint disable */
/*eslint-disable no-unused-vars */
import axios from 'axios'
import {normalize, schema} from 'normalizr'

import { BASE_URL_CIS_SOUTH } from '../../../util'

const baseUrl = () => {
  return `${BASE_URL_CIS_SOUTH}/clusters?format=brief`
}

const clusterSchema = new schema.Entity('clusters', {},{
  idAttribute: 'name'
})

/**
 * Fetch list of Clusters (Locations)
 * @return {Object} normalzed list of clusters
 */
export const fetchAll = () => {
  return axios.get(baseUrl())
  .then(({data}) => {
    return normalize(data, [ clusterSchema ])
  })
}
