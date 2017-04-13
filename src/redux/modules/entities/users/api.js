import axios from 'axios'
import { BASE_URL_AAA, PAGINATION_MOCK }  from '../../../util.js'
import { normalize, schema } from 'normalizr'

const baseURL = () => `${BASE_URL_AAA}/users`

const createQueryStr = (brand, account, group) => {
  const query = [];

  if (brand) {
    query.push(`brand_id=${brand}`)
  }

  if (account) {
    query.push(`account_id=${account}`)
  }

  if (group) {
    query.push(`group_id=${group}`)
  }

  return query.join('&')
}

const userSchema = new schema.Entity('users', {}, {
  idAttribute: 'email'
})

export const fetchAll = ({ brand, account, group }) => {
  return axios.get(`${baseURL()}?${createQueryStr(brand, account, group)}` , PAGINATION_MOCK)
    .then(({data}) => {
      return normalize(data.data, [userSchema])
    })
}

export const create = ({payload}) => {
  return axios.post(baseURL(),  payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({data}) => {
      return normalize(data, userSchema)
    })
}

export const update = ({id, payload}) => {
  return axios.post(`${baseURL()}/${id}`,  payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({data}) => {
      return normalize(data.data, userSchema)
    })
}

export const remove = ({id}) =>
  axios.delete(`${baseURL()}/${id}`)
    .then(() => ({id}))
