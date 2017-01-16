import axios from 'axios'
import {arrayOf, valuesOf, normalize} from 'normalizr'

import { BASE_URL_AAA }  from '../../../util.js'

import {Schemas} from '../schemas'

/**
 * Fetch single group
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @return {[type]}         [description]
 */
export const fetch = (brand, account, group) => {
  return axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts/${account}/groups/${group}`)
    .then( ({data}) => {
      return normalize(data, Schemas.group)
    })
}

/**
 * Fetch groups for an account
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @return {[type]}         [description]
 */
export const fetchAll = (brand, account) => {
  return axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts/${account}/groups`)
    .then( ({data}) => {
      const obj = {
        account: account,
        groups: data.data
      }
      return normalize(obj, Schemas.accountGroups)
    })
}
