import axios from 'axios'
import {normalize, schema} from 'normalizr'

import { BASE_URL_CIS_SOUTH } from '../../../util'


/*
{
    "geolocation": "us",
    "storage_type": "ssd",
    "name": "strg0"
}
 */

const baseUrl = () => {
  return `${BASE_URL_CIS_SOUTH}/clusters`
}

const clusterSchema = new schema.Entity('cluster', {},{
  idAttribute: 'name'
})



/**
 * Fetch list of Clusters (Locations)
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @return {[type]}         [description]
 */
export const fetchAll = () => {
  return axios.get(baseUrl())
    .then( ({data}) => {
      return normalize(data, [ clusterSchema ])
    })
}
