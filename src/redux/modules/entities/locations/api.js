import axios from 'axios'
import { normalize, schema } from 'normalizr'

import { BASE_URL_NORTH, PAGINATION_MOCK, buildReduxId } from '../../../util'

const baseUrl = ({ brand, account, group }) =>
  `${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/locations`

const locationSchema = new schema.Entity(
  'locations',
  {},
  {
    idAttribute: (({ group_id, id }) => buildReduxId(group_id, id)),
    processStrategy: value => ({
      name: value.id,
      reduxId: buildReduxId(value.group_id, value.id),
      brandId: value.brand_id,
      accountId: value.account_id,
      groupId: value.group_id,
      cloudName: value.cloud_name,
      cloudProvider: value.cloud_provider,
      cloudProviderRegion: value.cloud_region,
      cloudProviderLocationId: value.cloud_location_id,
      countryCode: value.country_code,
      state: value.state,
      cityName: value.city_name,
      iataCode: value.iata_code,
      street: value.street,
      postalCode: value.postalcode,
      latitude: value.lat,
      longitude: value.lon
    })
  }
)

/**
 * This endpoint also supports pagination. Extracting only object data for now.
 */
export const fetch = ({ id, ...params }) =>
  axios.get(`${baseUrl(params)}/${id}`)
    .then(({ data }) => {
      return normalize(data, locationSchema)
    })

export const fetchIds = (params) => {
  return axios.get(baseUrl(params), PAGINATION_MOCK)
    .then(({data}) => {
      return data
    })
}

export const fetchAll = (params) =>
  axios.get(baseUrl(params), PAGINATION_MOCK)
    .then(({ data }) => {
      return normalize(data.data, [ locationSchema ])
    })

export const create = ({ payload, ...urlParams }) =>
  axios.post(baseUrl(urlParams), payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => {
      return normalize(data, locationSchema)
    })

export const update = ({ id, payload, ...baseUrlParams }) =>
  axios.put(`${baseUrl(baseUrlParams)}/${id}`, payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => {
      return normalize(data, locationSchema)
    })

export const remove = ({ id, ...params }) =>
  axios.delete(`${baseUrl(params)}/${id}`)
    .then(() => ({ id: buildReduxId(params.group, id) }))
