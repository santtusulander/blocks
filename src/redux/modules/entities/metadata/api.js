import axios from 'axios'
import { BASE_URL_NORTH, PAGINATION_MOCK, buildReduxId }  from '../../../util.js'
import { normalize, schema } from 'normalizr'

const baseURL = (brand, account, group, property, serviceType) => `${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/published_hosts/${property}/services/${serviceType}/custom_policy_configs?force=true`

const metadataSchema = new schema.Entity('propertyMetadata', {}, {})

export const fetchAll = ({ brand, account, group, property, serviceType }) => {
  return axios.get(`${baseURL(brand, account, group, property, serviceType)}`, PAGINATION_MOCK)
    .then(({data}) => {

      return normalize({ id: buildReduxId(property, serviceType), customPolicyConfigs: data.data }, metadataSchema)
    })
}

export const create = ({ brand, account, group, property, serviceType, payload }) => {
  return axios.get(`${baseURL(brand, account, group, property, serviceType)}`,  payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({data}) => {

      return normalize({ id: buildReduxId(property, serviceType), customPolicyConfigs: data.data }, metadataSchema)
    })
}

export const update = ({ brand, account, group, property, serviceType, payload }) => {
  return axios.get(`${baseURL(brand, account, group, property, serviceType)}`,  payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({data}) => {

      return normalize({ id: buildReduxId(property, serviceType), customPolicyConfigs: data.data }, metadataSchema)
    })
}

export const remove = ({ brand, account, group, property, serviceType }) =>
  axios.delete(`${baseURL(brand, account, group, property, serviceType)}`)
    .then(() => {
      return buildReduxId(property, serviceType)
    })
