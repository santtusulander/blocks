import axios from 'axios'
import { normalize } from 'normalizr'

import { BASE_URL_AAA } from '../../../util.js'

import {Schemas} from '../schemas'

/**
 * Fetch single account
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @return {[type]}         [description]
 */
export const fetch = ({brand, account}) => {
  return axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts/${account}`)
    .then( ({data}) => {

      const accountData = {
        id: brand,
        accounts: [ data ]
      }

      return normalize(accountData, Schemas.brandAccounts)
    })
}

/**
 * Fetch accounts for a brand
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @return {[type]}         [description]
 */
export const fetchAll = ({brand}) => {
  return axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts`)
    .then( ({data}) => {

      const brandAccounts = {
        id: brand,
        accounts:  data.data
      }

      return normalize(brandAccounts, Schemas.brandAccounts)
    })

}
