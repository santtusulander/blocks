/*TODO: UDNP-2873 remove lint disable */
/*eslint-disable no-unused-vars */
import axios from 'axios'
import {normalize, schema} from 'normalizr'

import { BASE_URL_CIS_SOUTH } from '../../../util'


const mock = {
  "geolocation": "us",
  "storage_type": "ssd",
  "name": "strg0"
}

const mockArray = [
  {
    ...mock,
    name: "strg0"
  },
  {
    ...mock,
    name: "strg1"
  }
]


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
  return Promise.resolve( normalize(mockArray, [ clusterSchema ]) )

  // TODO: UDNP-2873 Uncomment when API is fixed
  // return axios.get(baseUrl())
  // .then( ({data}) => {
  //   return normalize(data, [ clusterSchema ])
  // })
}
