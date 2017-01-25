import { normalize, schema } from 'normalizr'
import axios from 'axios'

import { BASE_URL_NORTH } from '../../../util'

const baseURL = ({ brand, account, group, network, pop, pod }) =>
  `${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/networks/${network}/pops/${pop}/pods/${pod}/nodes`

const nodeSchema = new schema.Entity('nodes')

/**
 * This endpoint supports pagination. Extract only data objects for now.
 */
export const fetchAll = (urlParams) =>
  axios.get(baseURL(urlParams))
    .then(({ data }) => {
      return normalize(data.data, [ nodeSchema ])
    })

export const fetch = ({ id, ...baseUrlParams }) =>
  axios.get(`${baseURL(baseUrlParams)}/${id}`)
    .then(({ data }) => {
      return normalize(data, nodeSchema)
    })

export const create = ({ payload, ...urlParams }) =>
  axios.post(baseURL(urlParams), payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => normalize(data, nodeSchema))

export const update = ({ id, payload, ...baseUrlParams }) =>
  axios.put(`${baseURL(baseUrlParams)}/${id}`, payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => normalize(data, nodeSchema))

export const remove = ({ id, ...baseUrlParams }) =>
  axios.delete(`${baseURL(baseUrlParams)}/${id}`)
    .then(() => { id })
