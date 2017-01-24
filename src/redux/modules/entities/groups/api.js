import axios from 'axios'
import {normalize, schema} from 'normalizr'

import { BASE_URL_AAA }  from '../../../util.js'

const groupSchema = new schema.Entity('groups', {}, {
  processStrategy: (value, parent) => {
    return { ...value, parentId: parent.id}
  }
})

const accountGroupSchema = new schema.Entity('accountGroups', {
  groups: [ groupSchema ]
})

const baseURL = (brand, account) => `${BASE_URL_AAA}/brands/${brand}/accounts/${account}/groups`

/**
 * Fetch single group
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @return {[type]}         [description]
 */
export const fetch = ({brand, account, group}) => {
  return axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts/${account}/groups/${group}`)
    .then( ({data}) => {

      const accountGroups = {
        id: account,
        groups: [data]
      }

      return normalize(accountGroups, accountGroupSchema)
    })
}

/**
 * Fetch groups for an account
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @return {[type]}         [description]
 */
export const fetchAll = ({brand, account}) => {
  return axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts/${account}/groups`)
    .then( ({data}) => {

      const accountGroups = {
        id: account,
        groups: data.data
      }
      return normalize(accountGroups, accountGroupSchema)
    })
}


/**
 * create a new account
 * @param  {[type]} brand   [brand id]
 * @param  {[type]} payload [data to create account with]
 */
export const create = ({ brand, account, payload }) =>
  axios.post(baseURL(brand, account), payload)
    .then(({ data }) => {

      const accountData = {
        id: brand,
        accounts: data.data
      }

      return normalize(accountData, accountGroups)
    })

/**
 * update an account
 * @param  {[type]} brand   [brand id]
 * @param  {[type]} id      [account id]
 * @param  {[type]} payload [data to update account with]
 */
export const update = ({ brand, account, id, payload }) =>
  axios.put(`${baseURL(brand, account)}/${id}`, payload)
    .then(({ data }) => {

      const accountData = {
        id: brand,
        accounts: data.data
      }

      return normalize(accountData, accountSchema)
    })

/**
 * remove an account
 * @param  {[type]} brand [brand id]
 * @param  {[type]} id    [account id]
 */
export const remove = ({ brand, account, id }) =>
  axios.delete(`${baseURL(brand, account)}/${id}`)
    .then(() => ({ id }))
