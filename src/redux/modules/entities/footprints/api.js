import { normalize, schema } from 'normalizr'
import axios from 'axios'

import { BASE_URL_NORTH } from '../../../util'

const baseURL = ({ brand, account }) =>
  `${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/footprints`

const footprintSchema = new schema.Entity('footprints')

const normalizeWithParentId = (footprint, parentId) =>
  normalize({ ...footprint, parentId: parentId }, footprintSchema)

export const fetchAll = (urlParams) =>
  axios.get(baseURL(urlParams))
    .then(({ data }) => {
      return normalize(data.data, [ footprintSchema ])
    })

export const fetch = ({ id, ...baseUrlParams }) =>
  axios.get(`${baseURL(baseUrlParams)}/${id}`)
    .then(({ data }) => {
      return normalizeWithParentId(data, baseUrlParams.account)
    })

export const create = ({ payload, ...urlParams }) =>
  axios.post(baseURL(urlParams), payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => normalizeWithParentId(data, urlParams.account))

export const update = ({ id, payload, ...baseUrlParams }) =>
  axios.put(`${baseURL(baseUrlParams)}/${id}`, payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => normalizeWithParentId(data, baseUrlParams.account))

export const remove = ({ id, ...baseUrlParams }) =>
  axios.delete(`${baseURL(baseUrlParams)}/${id}`)
    .then(() => { id })
