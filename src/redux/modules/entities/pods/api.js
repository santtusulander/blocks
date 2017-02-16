import axios from 'axios'
import {normalize, schema} from 'normalizr'

import { BASE_URL_NORTH, buildReduxId } from '../../../util'

const baseUrl = ({ brand, account, group, network, pop }) => {
  return `${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/networks/${network}/pops/${pop}/pods`
}

export const pod = new schema.Entity('pods', {
  //footprints: [ footprint ]
}, {
  //Add POP-id tomake unique POD IDs
  idAttribute: (value, { group_id, network_id, id }) => { return buildReduxId(group_id, network_id, id, value.pod_name) },
  processStrategy: (value, parent) => {

    const {footprints, services: [ { /*ip_list,*/ lb_method, local_as, request_fwd_type, provider_weight, sp_bgp_router_ip, sp_bgp_router_as, sp_bgp_router_password } ] } = value

    /* UI - params are extracted from services to keep UI - object flat */
    return {
      parentId: buildReduxId(parent.group_id, parent.network_id, parent.id),
      UIName: value.pod_name,
      UIId: value.pod_name,
      UILbMethod: lb_method,
      UILocalAS: local_as,
      UIRequestFwdType: request_fwd_type,
      UIProviderWeight: provider_weight,
      UIDiscoveryMethod: footprints && footprints.length > 0 ? 'footprints' : 'BGP',
      //UIFootprints: footprints,
      //UIIpList: ip_list,
      UIsp_bgp_router_as: sp_bgp_router_as,
      UIsp_bgp_router_ip: sp_bgp_router_ip,
      UIsp_bgp_router_password: sp_bgp_router_password,

      ...value
    }
  }
})

const pop = new schema.Entity('podsWrapper', {
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
        group_id: params.group,
        network_id: params.network,
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
        group_id: params.group,
        network_id: params.network,
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
export const create = ({ payload, ...params }) => {
  return axios.post(baseUrl(params), payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => {

      const wrappedWithparent = {
        group_id: params.group,
        network_id: params.network,
        id: params.pop,
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
export const update = ({ id, payload, ...params }) => {
  return axios.put(`${baseUrl(params)}/${id}`, payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => {

      const wrappedWithparent = {
        group_id: params.group,
        network_id: params.network,
        id: params.pop,
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
export const remove = ({ id, ...params }) => {
  return axios.delete(`${baseUrl(params)}/${id}`)
    .then(() => ( { id: buildReduxId(params.group, params.network, params.pop, id) } ))
}
