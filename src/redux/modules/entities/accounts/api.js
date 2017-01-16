import axios from 'axios'
import {arrayOf, normalize} from 'normalizr'

import { BASE_URL_AAA }  from '../../../util.js'

import {Schemas} from '../schemas'

/**
 * Fetch single account
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @return {[type]}         [description]
 */
export const fetch = (brand, account) => {
  return axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts/${account}`)
    .then( ({data}) => {
      return normalize(data, Schemas.account)
    })
}

/**
 * Fetch accounts for a brand
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @return {[type]}         [description]
 */
export const fetchAll = (brand) => {
  console.warn('accounts.fetchAll() is not yet implemented.'), brand;
/*  return axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts`)
    .then( ({data}) => {
      const obj = {
        account: account,
        groups: data.data
      }
      return normalize(obj, Schemas.accountGroups)
    })
*/
}
