import axios from 'axios'
import {normalize, schema} from 'normalizr'

import { BASE_URL_NORTH } from '../../../util'

const baseUrl = ({ brand, account, group }) => {
  return `${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/networks`
}

const networkSchema = new schema.Entity('networks', {
  //footprints: [ footprint ]
}, {
  idAttribute: (value, parent) => { return `${parent.id}-${value.pod_name}`},
  processStrategy: (value, parent) => {
    return { ...value, parentId: parent.id}
  }
})

/**
 * Fetch single NETWORK
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @return {[type]}         [description]
 */
export const fetch = ({id, ...params}) => {
  return axios.get(`${baseUrl(params)}/${id}`)
    .then( ({data}) => {
      const wrappedWithparent = {
        id: params.group,
        networks: [data]
      }
      return normalize(wrappedWithparent, networkSchema)
    })
}

/**
 * Fetch list of NETWORKs
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @return {[type]}         [description]
 */
export const fetchAll = ( params ) => {
  return axios.get(baseUrl(params))
    .then( ({data}) => {
      const wrappedWithparent = {
        id: params.pop,
        networkds: data.data
      }

      return normalize(wrappedWithparent, networkSchema)
    })
}

/**
 * Create a NETWORK
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @return {[type]} norm   [description]
 */
export const create = ({ payload, ...urlParams }) => {
  return axios.post(baseUrl(urlParams), payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => {
      return normalize(data, networkSchema)
    })
}

/**
 * Update a NETWORK
 * @param  {[type]} id            [description]
 * @param  {[type]} payload       [description]
 * @param  {[type]} baseUrlParams [description]
 * @return {[type]}               [description]
 */
export const update = ({ id, payload, ...baseUrlParams }) => {
  return axios.put(`${baseUrl(baseUrlParams)}/${id}`, payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => {
      return normalize(data, networkSchema)
    })
}

/**
 * Remove a NETWORK
 * @param  {[type]} id            [description]
 * @param  {[type]} baseUrlParams [description]
 * @return {[type]}               [description]
 */
export const remove = ({ id, ...baseUrlParams }) => {
  return axios.delete(`${baseUrl(baseUrlParams)}/${id}`)
    .then(() => { id })
}
