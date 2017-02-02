import axios from 'axios'
import {normalize, schema} from 'normalizr'

import { BASE_URL_NORTH } from '../../../util'

const baseUrl = ({ brand, account, group, network, pop }) => {
  return `${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/networks/${network}/pops/${pop}/pods`
}

const pod = new schema.Entity('pods', {
  //footprints: [ footprint ]
}, {
  idAttribute: (value, parent) => { return `${parent.id}-${value.pod_name}`},
  processStrategy: (value, parent) => {
    return {
      ...value,
      parentId: parent.id,
      name: value.pod_name
    }
  }
})

const pop = new schema.Entity('pops', {
  pods: [ pod ]
})

/**
 * Fetch single POD
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @return {[type]}         [description]
 */
export const fetch = ({id, ...params}) => {
  return axios.get(`${baseUrl(params)}/${id}`)
    .then( ({data}) => {
      const wrappedWithparent = {
        id: params.pop,
        pods: [data]
      }
      return normalize(wrappedWithparent, pop)
    })
}

/**
 * Fetch list of POD
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @return {[type]}         [description]
 */
export const fetchAll = ( params ) => {
  return axios.get(baseUrl(params))
    .then( ({data}) => {
      const wrappedWithparent = {
        id: params.pop,
        pods: data.data
      }

      return normalize(wrappedWithparent, pop)
    })
}

/**
 * Create a POD
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @return {[type]} norm   [description]
 */
export const create = ({ payload, ...urlParams }) => {
  return axios.post(baseUrl(urlParams), payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => {
      return normalize(data, pod)
    })
}

/**
 * Update a POD
 * @param  {[type]} id            [description]
 * @param  {[type]} payload       [description]
 * @param  {[type]} baseUrlParams [description]
 * @return {[type]}               [description]
 */
export const update = ({ id, payload, ...baseUrlParams }) => {
  return axios.put(`${baseUrl(baseUrlParams)}/${id}`, payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => {
      return normalize(data, pod)
    })
}

/**
 * Remove a POD
 * @param  {[type]} id            [description]
 * @param  {[type]} baseUrlParams [description]
 * @return {[type]}               [description]
 */
export const remove = ({ id, ...baseUrlParams }) => {
  return axios.delete(`${baseUrl(baseUrlParams)}/${id}`)
    .then(() => ( {id} ))
}
