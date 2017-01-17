import axios from 'axios'
import {normalize} from 'normalizr'

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

      const accountGroups = {
        id: account,
        groups: [data]
      }

      return normalize(accountGroups, Schemas.accountGroups)
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

      const accountGroups = {
        id: account,
        groups: data.data
      }
      return normalize(accountGroups, Schemas.accountGroups)
    })
}
