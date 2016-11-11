import axios from 'axios'
import { BASE_URL_NORTH }  from '../../util.js'
import {arrayOf, normalize, Schema} from 'normalizr'

export const propertySchema = new Schema('properties', {idAttribute: 'published_host_id'})

const normalizeApiResponse = (data, schema) => {
  return normalize(data, schema)
}

const fetchHost = (brand, account, group, id) => {
  return axios.get(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/published_hosts/${id}`)
}

const fetchHostIds = (brand, account, group) => {
  return axios.get(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/published_hosts`)
}

export const fetch = (brand, account, group, id) => {
  return fetchHost(brand, account, group, id)
    .then( ({data}) => normalizeApiResponse(data, propertySchema ) )
}

export const fetchAll = (brand, account, group) => {
  return fetchHostIds(brand, account, group)
    .then( ({data}) => {
      const objs = data.map( val => ({published_host_id: val}) )
      return normalizeApiResponse(objs, arrayOf(propertySchema))
    })
}

export const fetchAllWithDetails = (brand, account, group) => {
  return fetchHostIds(brand, account, group)
    .then( ({data}) => {
      const promises = data.map( id => fetchHost(brand,account,group,id) )
      return Promise.all( promises )
    })
    .then( (allData) => {
      //get rid of data.data
      const data = allData.map( item => item.data)
      return normalizeApiResponse(data, arrayOf(propertySchema))
    })
}
