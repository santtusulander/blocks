import axios from 'axios'
import { normalize, schema } from 'normalizr'

import { BASE_URL_NORTH } from '../../../util'

const baseUrl = ({ brand, account, group }) =>
  `${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/locations`

const locationSchema = new schema.Entity('locations')

/**
 * This endpoint also supports pagination. Extracting only object data for now.
 */
export const fetch = ({ id, ...params }) =>
  axios.get(`${baseUrl(params)}/${id}`)
    .then(({ data }) => {
      return normalize({ id: params.group, locations: [ data ] }, locationSchema)
    })

export const fetchIds = ( params ) => {
  return axios.get(baseUrl(params))
  .then( ({data}) => {
    return data
  })
}

export const fetchAll = ( params ) =>
  axios.get(baseUrl(params))
    .then(({ data }) => {
      return normalize({ id: params.group, locations: [ data ] }, locationSchema)
    })

export const create = ({ payload, ...urlParams }) =>
  axios.post(baseUrl(urlParams), payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => {
      return normalize({ id: urlParams.group, locations: [ data ]}, locationSchema)
    })

export const update = ({ id, payload, ...baseUrlParams }) =>
  axios.put(`${baseUrl(baseUrlParams)}/${id}`, payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => {
      return normalize({ id: baseUrlParams.group, locations: [ data ] }, locationSchema)
    })

export const remove = ({ id, ...baseUrlParams }) =>
  axios.delete(`${baseUrl(baseUrlParams)}/${id}`)
    .then(() => ({ id }))
