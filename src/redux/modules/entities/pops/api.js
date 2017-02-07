import axios from 'axios'
import {normalize, schema} from 'normalizr'

import { BASE_URL_NORTH, buildReduxId } from '../../../util'

/* TODO: After FOOTPRINTS are merged, import schema from 'footprints' -module */
const footprint = new schema.Entity('footprints')

/* TODO: After POD is merged, import schema from 'pod' -module */
const pod = new schema.Entity('pods', {
  footprints: [ footprint ]
}, {
  idAttribute: (value, parent) => { return buildReduxId(parent.group_id, parent.network_id, parent.id, value.pod_name) },
  processStrategy: (value, parent) => {
    return { ...value, parentId: parent.id}
  }
})

const pop = new schema.Entity('pops',
  { pods: [ pod ] },
  { idAttribute: ({ group_id, network_id, id }) => buildReduxId(group_id, network_id, id) })

const baseUrl = ({ brand, account, group, network }) => {
  return `${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/networks/${network}/pops`
}

/**
 * Fetch single pop
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @return {[type]}         [description]
 */
export const fetch = ({id, ...params}) => {
  return axios.get(`${baseUrl(params)}/${id}`)
    .then( ({data}) => {
      return normalize(data, pop)
    })
}

/**
 * Fetch list of POPs
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @return {[type]}         [description]
 */
export const fetchAll = ( params ) => {
  return axios.get(baseUrl(params))
    .then( ({data}) => {
      return normalize(data.data, [ pop ])
    })
}

/**
 * Create a POP
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @return {[type]} norm   [description]
 */
export const create = ({ payload, ...urlParams }) => {
  return axios.post(baseUrl(urlParams), payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => {
      return normalize(data, pop)
    })
}

/**
 * Update a POP
 * @param  {[type]} id            [description]
 * @param  {[type]} payload       [description]
 * @param  {[type]} baseUrlParams [description]
 * @return {[type]}               [description]
 */
export const update = ({ id, payload, ...baseUrlParams }) => {
  return axios.put(`${baseUrl(baseUrlParams)}/${id}`, payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => {
      return normalize(data, pop)
    })
}

/**
 * Remove a POP
 * @param  {[type]} id            [description]
 * @param  {[type]} baseUrlParams [description]
 * @return {[type]}               [description]
 */
export const remove = ({ id, ...params }) => {
  return axios.delete(`${baseUrl(params)}/${id}`)
    .then(() => ({ id: buildReduxId(params.group, params.network, id) }))
}
