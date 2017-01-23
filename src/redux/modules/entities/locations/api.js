import { normalize, schema } from 'normalizr'
import axios from 'axios'

import { BASE_URL_NORTH } from '../../../util'

const baseURL = ({ brand, account, group }) =>
  `${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/locations`

const locationSchema = new schema.Entity('locations')

/**
 * This endpoint also supports pagination. Extracting only object data for now.
 */
export const fetchAll = (urlParams) =>
  axios.get(baseURL(urlParams))
    .then(({ data }) => {
      return normalize(data.data, [ locationSchema ])
    })

export const fetch = ({ id, ...baseUrlParams }) =>
  axios.get(`${baseURL(baseUrlParams)}/${id}`)
    .then(({ data }) => {
      return normalize(data, locationSchema)
    })

export const create = ({ payload, ...urlParams }) =>
  axios.post(baseURL(urlParams), payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => normalize(data, locationSchema))

export const update = ({ id, payload, ...baseUrlParams }) =>
  axios.put(`${baseURL(baseUrlParams)}/${id}`, payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => normalize(data, locationSchema))

export const remove = ({ id, ...baseUrlParams }) =>
  axios.delete(`${baseURL(baseUrlParams)}/${id}`)
    .then(() => { id })
