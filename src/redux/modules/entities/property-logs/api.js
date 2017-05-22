import axios from 'axios'
import { BASE_URL_NORTH, qsBuilder }  from '../../../util.js'
import { normalize, schema } from 'normalizr'

const baseURL = (brand, account, group, host) =>
  `${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/published_hosts/${host}/log_delivery`

const infoURL = (params) =>
  `${BASE_URL_NORTH}${params ? qsBuilder(params) : ''}`

const propertySchema = new schema.Entity('properties', {},
  {
    idAttribute: 'published_host_id',
    processStrategy: (value, parent) => {
      return { ...value, parentId: parent.id }
    }
  }
)

const groupPropertiesSchema = new schema.Entity('grpProperties', { properties: [ propertySchema ] })

export const fetchInfo = ({ params }) => {
  return axios.get(`${infoURL(params)}`)
    .then(({ data }) => {
      return normalize({ id: params.published_host_id, properties: [ data ] }, groupPropertiesSchema)
    })
}

export const fetch = ({ brand, account, group, host }) => {
  return axios.get(`${baseURL(brand, account, group, host)}`)
    .then(({ data }) => {
      return normalize({ id: group, properties: [ data ] }, groupPropertiesSchema)
    })
}

export const create = ({ brand, account, group, host, payload }) =>
  axios.post(`${baseURL(brand, account, group, host)}}`, payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => {
      return normalize({ id: group, properties: [ data ] }, groupPropertiesSchema)
    })

export const update = ({ brand, account, group, host, payload }) =>
  axios.put(`${baseURL(brand, account, group, host)}}`, payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => {
      return normalize({ id: group, properties: [ data ] }, groupPropertiesSchema)
    })

export const remove = ({ brand, account, group, host }) =>
  axios.delete(`${baseURL(brand, account, group, host)}`)
    .then(() => ({ host }))
