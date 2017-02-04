import axios from 'axios'
import {normalize, schema} from 'normalizr'

import { BASE_URL_NORTH } from '../../../util'

const baseUrl = ({ brand, account, group, network, pop }) => {
  return `${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/networks/${network}/pops/${pop}/pods`
}

const pod = new schema.Entity('pods', {
  //footprints: [ footprint ]
}, {
  //Add POP-id tomake unique POD IDs
  idAttribute: (value, parent) => { return `${parent.id}-${value.pod_name}`},
  processStrategy: (value, parent) => {

    const {footprints, services: [ { cloud_lookup_id, lb_method, local_as, request_fwd_type, provider_weight, sp_bgp_router_ip, sp_bgp_router_as, sp_bgp_router_password } ] } = value

    /* UI - params are extracted from services to keep UI - object flat */
    return {
      parentId: parent.id,
      UIName: value.pod_name,
      UIId: value.pod_name,
      UICloudLookUpId: cloud_lookup_id,
      UILbMethod: lb_method,
      UILocalAS: local_as,
      UIRequestFwdType: request_fwd_type,
      UIProviderWeight: provider_weight,
      UIDiscoveryMethod: footprints && footprints.length > 0 ? 'footprints' : 'BGP',
      UIFootprints: [{label: 'test FP', id: 'test', removed: false}, {label: 'test FP 2', id: 'test-2', removed: false}],
      UIBGP: {
        sp_bgp_router_as,
        sp_bgp_router_ip,
        sp_bgp_router_password
      },
      ...value
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

      const wrappedWithparent = {
        id: urlParams.pop,
        pods: [data]
      }

      return normalize(wrappedWithparent, pop)
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

      const wrappedWithparent = {
        id: baseUrlParams.pop,
        pods: [data]
      }

      return normalize(wrappedWithparent, pop)
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
    .then(() => ( { id: `${baseUrlParams.pop}-${id}` } ))
}
