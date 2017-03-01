import axios from 'axios'
import { BASE_URL_NORTH, PAGINATION_MOCK }  from '../../../util.js'
import { normalize, schema } from 'normalizr'

const baseURL = (brand, account, group) => `${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/published_hosts`

const publishedName = ({ services }) => services[0].configurations[0].edge_configuration.published_name

const propertySchema = new schema.Entity('properties', {},
  {
    idAttribute: 'published_host_id',
    processStrategy: (value, parent) => {
      return { ...value, parentId: parent.id }
    }
  }
)

const groupPropertiesSchema = new schema.Entity('grpProperties', { properties: [ propertySchema ] })

export const fetch = ({ brand, account, group, id }) => {
  return axios.get(`${baseURL(brand, account, group)}/${id}`)
    .then(({ data }) => {
      return normalize({ id: group, properties: [ data ] }, groupPropertiesSchema)
    })
}

export const fetchAll = ({ brand, account, group }) => {
  return axios.get(baseURL(brand, account, group), PAGINATION_MOCK)
    .then(({data: { data }}) =>
      data.reduce((object, id) => {

        object.entities.properties[id] = { parentId: group, published_host_id: id }

        return object

      }, { entities: { properties: {} } })
    )
}

export const fetchIds = ({ brand, account, group }) => {
  return axios.get(baseURL(brand, account, group))
    .then(({ data }) => data)
}

export const create = ({ brand, account, group, payload }) =>
  axios.post(`${baseURL(brand, account, group)}/${publishedName(payload)}`, payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => {
      return normalize({ id: group, properties: [ data ] }, groupPropertiesSchema)
    })

export const update = ({ brand, account, group, payload }) =>
  axios.put(`${baseURL(brand, account, group)}/${publishedName(payload)}`, payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => {
      return normalize({ id: group, properties: [ data ] }, groupPropertiesSchema)
    })

export const remove = ({ brand, account, group, id }) =>
  axios.delete(`${baseURL(brand, account, group)}/${id}`)
    .then(() => ({ id }))
