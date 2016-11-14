import axios from 'axios'
import { BASE_URL_NORTH, BASE_URL_AAA }  from '../../util.js'
import {arrayOf, normalize, Schema} from 'normalizr'

export const propertySchema = new Schema('properties', {idAttribute: 'published_host_id'})

const normalizeApiResponse = (data, schema) => {
  return normalize(data, schema)
}

const fetchHost = (brand, account, group, id) => {
  return axios.get(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/published_hosts/${id}`)
    .then( (data) => {

      //add details (TODO? normalize this relation)
      data.data.brandId = brand
      data.data.accountId = parseInt(account)
      data.data.groupId = parseInt(group)

      return data
    })
}

const fetchHostIds = (brand, account, group) => {
  return axios.get(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/published_hosts`)
}

const fetchGroupsIds = (brand, account) => {

  return axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts/${account}/groups`)
    .then( ({data}) => {
      const groupIds = data.data.map( group => {
        return group.id
      })

      return groupIds
    })
}
export const fetch = (brand, account, group, id) => {
  return fetchHost(brand, account, group, id)
    .then( ({data}) =>
      normalizeApiResponse(data, propertySchema ) )
}

export const fetchAll = (brand, account, group) => {
  return fetchHostIds(brand, account, group)
    .then( ({data}) => {
      const objs = data.map( val => ({published_host_id: val}) )
      return normalizeApiResponse(objs, arrayOf(propertySchema))
    })
}

const fetchGroupProperties = (brand, account, groupIds) => {
  return Promise.all( groupIds.map( group => {
    return fetchHostIds(brand, account, group)
      .then( ({data}) => {
        const promises = data.map( id => fetchHost(brand,account,group,id) )
        return Promise.all( promises )
      })
      .then( (allData) => {
        //flatten data.data
        const data = allData.map( item => item.data)
        return normalizeApiResponse(data, arrayOf(propertySchema))
      })
  }))
}

const getGroupIds = (brand, account, group) => {
  let groupIds = []
  if (group) {
    groupIds.push(group)
    return Promise.resolve(groupIds)
  } else {
    return fetchGroupsIds(brand, account)
  }
}
export const fetchAllWithDetails = (brand, account, group) => {
  return getGroupIds(brand, account, group)
    .then(groups => {
      return fetchGroupProperties(brand, account, groups)
    })
    .then( data => {
      let merged

      data.map( groupHosts => {
        merged = Object.assign( {}, merged, groupHosts)
      })
      return merged
    })
}
