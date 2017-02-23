import axios from 'axios'
import {normalize, schema} from 'normalizr'

import { BASE_URL_NORTH, buildReduxId } from '../../../util'

const baseUrl = ({ brand, account, group }) => {
  return `${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/networks`
}

const networkSchema = new schema.Entity('networks', {},{
  idAttribute: (network, group) => buildReduxId(group.id, network.id),
  processStrategy: (value, parent) => {
    return {
      ...value,
      parentId: parent.id,

      //UI expects name key
      name: value.id}
  }
})

const groupNetworks = new schema.Entity('groupNetworks', { networks: [ networkSchema ] })

/**
 * Fetch single NETWORK
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @return {[type]}         [description]
 */
export const fetch = ({id, ...params}) => {
  return axios.get(`${baseUrl(params)}/${id}`)
    .then( ({data}) => {
      return normalize({ id: params.group, networks: [ data ] }, groupNetworks)
    })
}

/**
* Fetch list of NETWORK Ids
* @param  {[type]} brand   [description]
* @param  {[type]} account [description]
* @return {[type]}         [description]
*/
export const fetchIds = ( params ) => {
  return axios.get(baseUrl(params))
   .then( ({data}) => {
     return data
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
      return normalize({ id: params.group, networks: [ data ] }, groupNetworks)
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
      return normalize({ id: urlParams.group, networks: [ data ] }, groupNetworks)

      //return normalize(data, networkSchema)
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
      return normalize({ id: baseUrlParams.group, networks: [ data ] }, groupNetworks)
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
    .then(() => ({ id: buildReduxId(baseUrlParams.group, id) }))
}
