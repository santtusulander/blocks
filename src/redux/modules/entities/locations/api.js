import axios from 'axios'
import { normalize, schema } from 'normalizr'

import { BASE_URL_NORTH } from '../../../util'

const baseUrl = ({ brand, account, group }) =>
  `${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/locations`

const locationSchema = new schema.Entity('locations', {}, {
  processStrategy: (value, parent) => {
    return {
      parentId: parent.id,
      name: value.id,
      brand: value.brand_id,
      account: value.account_id,
      group: value.group_id,
      cloudName: value.cloud_name,
      cloudProvider: value.cloud_provider,
      cloudRegion: value.cloud_region,
      cloudProviderLocationId: value.cloud_location_id,
      countryCode: value.country_code,
      state: value.state,
      cityName: value.city_name,
      iataCode: value.iata_code,
      street: value.street,
      postalCode: value.postalcode,
      latitude: value.lat,
      longitude: value.lon,
      ...value
    }
  }
})

const groupLocations = new schema.Entity('groupLocations', { locations: [ locationSchema ] })

/**
 * This endpoint also supports pagination. Extracting only object data for now.
 */
export const fetch = ({ id, ...params }) =>
  axios.get(`${baseUrl(params)}/${id}`)
    .then(({ data }) => {
      return normalize({ id: params.group, locations: [ data ] }, groupLocations)
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
      return normalize({ id: params.group, locations: data.data }, groupLocations)
    })

export const create = ({ payload, ...urlParams }) =>
  axios.post(baseUrl(urlParams), payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => {
      return normalize({ id: urlParams.group, locations: [ data ]}, groupLocations)
    })

export const update = ({ id, payload, ...baseUrlParams }) =>
  axios.put(`${baseUrl(baseUrlParams)}/${id}`, payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => {
      return normalize({ id: baseUrlParams.group, locations: [ data ] }, groupLocations)
    })

export const remove = ({ id, ...baseUrlParams }) =>
  axios.delete(`${baseUrl(baseUrlParams)}/${id}`)
    .then(() => ({ id }))
