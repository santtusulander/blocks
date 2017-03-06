import axios from 'axios'
import {normalize, schema} from 'normalizr'

import { BASE_URL_AAA, PAGINATION_MOCK }  from '../../../util.js'

const groupSchema = new schema.Entity('groups', {}, {
  processStrategy: (value, parent) => {
    return { ...value, parentId: parent.id}
  }
})

const accountGroupSchema = new schema.Entity('accountGroups', {
  groups: [ groupSchema ]
})

const baseURL = (brand, account) => `${BASE_URL_AAA}/brands/${brand}/accounts/${account}/groups`

export const fetch = ({brand, account, id}) => {
  return axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts/${account}/groups/${id}`)
    .then( ({data}) => {

      const accountGroups = {
        id: account,
        groups: [ data ]
      }

      return normalize(accountGroups, accountGroupSchema)
    })
}

export const fetchAll = ({ brand, account }) => {
  return axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts/${account}/groups`, PAGINATION_MOCK)
    .then( ({data}) => {

      const accountGroups = {
        id: account,
        groups: data.data
      }
      return normalize(accountGroups, accountGroupSchema)
    })
}

export const create = ({ brand, account, payload }) =>
  axios.post(baseURL(brand, account), payload)
    .then(({ data }) => {

      const accountGroups = {
        id: account,
        groups: [ data ]
      }

      return normalize(accountGroups, accountGroupSchema)
    })

export const update = ({ brand, account, id, payload }) =>
  axios.put(`${baseURL(brand, account)}/${id}`, payload)
    .then(({ data }) => {

      const accountGroups = {
        id: account,
        groups: [ data ]
      }

      return normalize(accountGroups, accountGroupSchema)
    })

/**
 * remove an account
 * @param  {[type]} brand [brand id]
 * @param  {[type]} id    [account id]
 */
export const remove = ({ brand, account, id }) =>
  axios.delete(`${baseURL(brand, account)}/${id}`)
    .then(() => ({ id }))
