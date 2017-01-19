import { normalize, schema } from 'normalizr'
import axios from 'axios'

import { BASE_URL_NORTH } from '../../../util'

const baseURL = ({ brand, account, group, pop }) =>
  `${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/networks/${brand}/pops/${pop}/nodes`

const nodeSchema = new schema.Entity('nodes')

export const fetchAll = (urlParams) =>
  axios.get(baseURL(urlParams))
    .then(({ data }) => {
      console.log(data)
      return data
    })

export const fetch = ({ id, ...baseUrlParams }) =>
  axios.get(`${baseURL(baseUrlParams)}/${id}`)
    .then(({ data }) => {
      console.log(data)
      return normalize(data, nodeSchema)
    })

export const create = ({ payload, ...urlParams }) =>
  axios.post(baseURL(urlParams), payload)
    .then(({ data }) => normalize(data, nodeSchema))

export const update = ({ id, payload, ...baseUrlParams }) =>
  axios.put(`${baseURL(baseUrlParams)}/${id}`, payload)
    .then(({ data }) => normalize(data, nodeSchema))

export const remove = ({ id, ...baseUrlParams }) =>
  axios.delete(`${baseURL(baseUrlParams)}/${id}`)
    .then(() => { id })
