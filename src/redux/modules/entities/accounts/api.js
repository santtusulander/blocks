import axios from 'axios'
import { normalize, schema } from 'normalizr'

import { BASE_URL_AAA } from '../../../util.js'

const accountSchema = new schema.Entity('accounts', {}, {
  processStrategy: (value, parent) => {
    return { ...value, parentId: parent.id}
  }
})

const brandAccountSchema = new schema.Entity('brandAccounts', {
  accounts: [ accountSchema ]
})

const baseURL = brand => `${BASE_URL_AAA}/brands/${brand}/accounts`

/**
 * Fetch single account
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @return {[type]}         [description]
 */
export const fetch = ({brand, id }) => {
  return axios.get(`${baseURL(brand)}/${id}`)
    .then( ({ data }) => {

      const accountData = {
        id: brand,
        accounts: [ data ]
      }

      return normalize(accountData, brandAccountSchema)
    })
}

/**
 * Fetch accounts for a brand
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @return {[type]}         [description]
 */
export const fetchAll = ({ brand }) => {
  return axios.get(baseURL(brand))
    .then( ({data}) => {

      const brandAccounts = {
        id: brand,
        accounts: data.data
      }

      return normalize(brandAccounts, brandAccountSchema)
    })
}

/**
 * create a new account
 * @param  {[type]} brand   [brand id]
 * @param  {[type]} payload [data to create account with]
 */
export const create = ({ brand, payload }) =>
  axios.post(baseURL(brand), payload)
    .then(({ data }) => {

      const brandAccounts = {
        id: brand,
        accounts: [ data ]
      }

      return normalize(brandAccounts, brandAccountSchema)
    })

/**
 * update an account
 * @param  {[type]} brand   [brand id]
 * @param  {[type]} id      [account id]
 * @param  {[type]} payload [data to update account with]
 */
export const update = ({ brand, id, payload }) =>
  axios.put(`${baseURL(brand)}/${id}`, payload)
    .then(({ data }) => {

      const brandAccounts = {
        id: brand,
        accounts: [ data ]
      }

      return normalize(brandAccounts, brandAccountSchema)
    })

/**
 * remove an account
 * @param  {[type]} brand [brand id]
 * @param  {[type]} id    [account id]
 */
export const remove = ({ brand, id }) =>
  axios.delete(`${baseURL(brand)}/${id}`)
    .then(() => ({ id }))
