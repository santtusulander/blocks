import axios from 'axios'
import {arrayOf, valuesOf, normalize} from 'normalizr'

import { BASE_URL_NORTH }  from '../../../util.js'

import {Schemas} from '../schemas'

/**
 * Fetch single host and normalize
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @param  {[type]} group   [description]
 * @param  {[type]} id      [description]
 * @return {[type]}         [description]
 */
export const fetch = (brand, account, group, id) => {
  return axios.get(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/published_hosts/${id}`)
    .then( ({data}) => {

      //REMOVE
      //
      //add meta (TODO? normalize this relation)
      /*const obj = {
        brand: {id: brand},
        account: {id: parseInt(account)},
        group: {id: parseInt(group)},
        ...data
      }*/

      return normalize(data, Schemas.property)
    })
}

/**
 * Fetch All host ids of a group
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @param  {[type]} group   [description]
 * @return {[type]}         [description]
 */
export const fetchAll = (brand, account, group) => {
  return axios.get(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/published_hosts`)
    .then( ({data}) => {
      const obj = {
        group: group,
        properties: data
      }
      return normalize(obj, Schemas.groupProperties)
    })
}
