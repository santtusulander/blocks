/*TODO: UDNP-2837 remove lint disable */
/*eslint-disable no-unused-vars */
import axios from 'axios'
import {normalize, schema} from 'normalizr'

import { BASE_URL_CIS_SOUTH } from '../../../util'


const mockData = {
  "geolocation": "us",
  "storage_type": "ssd",
  "name": "strg0"
}

const baseUrl = () => {
  return `${BASE_URL_CIS_SOUTH}/clusters`
}

const clusterSchema = new schema.Entity('clusters', {},{
  idAttribute: 'name'
})



/**
 * Fetch list of Clusters (Locations)
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @return {[type]}         [description]
 */
export const fetchAll = ({}) => {
  return Promise.resolve( normalize([mockData], [ clusterSchema ]) )

  // TODO: UDNP-2873 Uncomment when API is fixed
  // return axios.get(baseUrl())
  // .then( ({data}) => {
  //   return normalize(data, [ clusterSchema ])
  // })
}
