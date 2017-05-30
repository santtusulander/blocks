import axios from 'axios'
import { BASE_URL_NORTH, qsBuilder }  from '../../../util.js'
import {normalize, schema} from 'normalizr'


const baseURL = (brand, account, group, host) =>
  `${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/published_hosts/${host}/log_delivery`

const infoURL = (params) =>
  `${BASE_URL_NORTH}${params ? qsBuilder(params) : ''}`

const propLogsConfigSchema = new schema.Entity('propertiesLogsConfig', {}, {
  idAttribute: 'published_host_id'
})

export const fetchInfo = ({ params }) => {
  return axios.get(`${infoURL(params)}`)
    .then(({ data }) => {
      return data
    })
}

export const fetch = ({ brand, account, group, host }) => {
  return axios.get(`${baseURL(brand, account, group, host)}`)
    .then(({ data }) => {
      return data.data[0] ? normalize(data.data[0], propLogsConfigSchema) : {}
    })
}

export const create = ({ brand, account, group, host, payload }) =>
  axios.post(`${baseURL(brand, account, group, host)}`, payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => {
      return normalize(data, propLogsConfigSchema)
    })

export const update = ({ brand, account, group, host, payload }) =>
  axios.put(`${baseURL(brand, account, group, host)}`, payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => {
      return normalize(data, propLogsConfigSchema)
    })

export const remove = ({ brand, account, group, host }) =>
  axios.delete(`${baseURL(brand, account, group, host)}`)
    .then(() => ({ host }))
