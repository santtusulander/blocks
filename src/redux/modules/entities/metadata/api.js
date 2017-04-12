import axios from 'axios'
import { BASE_URL_NORTH, PAGINATION_MOCK, buildReduxId }  from '../../../util.js'
import { normalize, schema } from 'normalizr'

const baseURL = (brand, account, group, property, serviceType) => `${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/published_hosts/${property}/services/${serviceType}/custom_policy_configs`

const metadataSchema = new schema.Entity('propertyMetadata', {}, {})

export const fetchAll = ({ brand, account, group, property, serviceType }) => {
  return axios.get(`${baseURL(brand, account, group, property, serviceType)}?force=true`, PAGINATION_MOCK)
    .then(({data}) => {

      const [customPolicyConfig] = data.data
      return normalize({ id: buildReduxId(property, serviceType), customPolicyConfig }, metadataSchema)
    })
}

export const create = ({ brand, account, group, property, serviceType, payload }) => {
  return axios.post(`${baseURL(brand, account, group, property, serviceType)}`,  payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({data}) => {
      const [customPolicyConfig] = data.data
      return normalize({ id: buildReduxId(property, serviceType), customPolicyConfig }, metadataSchema)
    })
}

export const update = ({ brand, account, group, property, serviceType, payload }) => {
  return axios.put(`${baseURL(brand, account, group, property, serviceType)}`,  payload, { headers: { 'Content-Type': 'application/json' } })
    .then((data) => {
      const customPolicyConfig = data.data
      return normalize({ id: buildReduxId(property, serviceType), customPolicyConfig}, metadataSchema)
    })
}

export const remove = ({ brand, account, group, property, serviceType }) =>
  axios.delete(`${baseURL(brand, account, group, property, serviceType)}`)
    .then(() => {
      return buildReduxId(property, serviceType)
    })
