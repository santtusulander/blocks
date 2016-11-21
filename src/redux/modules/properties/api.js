import axios from 'axios'
import { BASE_URL_NORTH, BASE_URL_AAA }  from '../../util.js'
import {arrayOf, normalize, Schema} from 'normalizr'

export const propertySchema = new Schema('properties', {idAttribute: 'published_host_id'})

/**
 * Fetch single host and normalize
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @param  {[type]} group   [description]
 * @param  {[type]} id      [description]
 * @return {[type]}         [description]
 */
export const fetch = (brand, account, group, id) => {
  return fetchHost(brand, account, group, id)
    .then( ({data}) => normalize(data, propertySchema ) )
}

/**
 * Fetch All host ids of a group
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @param  {[type]} group   [description]
 * @return {[type]}         [description]
 */
export const fetchAll = (brand, account, group) => {
  return fetchHostIds(brand, account, group)
    .then( ({data}) => {
      const objs = data.map( val => ({published_host_id: val}) )
      return normalize(objs, arrayOf(propertySchema))
    })
}


/**
 * Get all hosts and their details for an account or group
 * @param  {brandId} brand   brandId
 * @param  {accountId} account accountId
 * @param  {groupId} group   groupId
 * @return {} Merged object with published_host_id as key
 */
export const fetchAllWithDetails = (brand, account, group) => {
  return getGroupIds(brand, account, group)
    .then(groups => {
      return fetchGroupProperties(brand, account, groups)
    })
    .then( data => {
      return normalize(data, arrayOf(propertySchema))
    })
}

/**
 * Fetch Single host from API
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @param  {[type]} group   [description]
 * @param  {[type]} id      [description]
 * @return {[type]}         [description]
 */
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

/**
 * Get Array of host ids from API (for a group)
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @param  {[type]} group   [description]
 * @return Array array of host names (ids)
 */
const fetchHostIds = (brand, account, group) => {
  return axios.get(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/published_hosts`)
}


/**
 * Fetch group ids for an account
 * @param  {[type]} brand   [description]
 * @param  {[type]} account [description]
 * @return {[type]}         [description]
 */
const fetchGroupsIds = (brand, account) => {
  return axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts/${account}/groups`)
    .then( ({data}) => {
      const groupIds = data.data.map( group => {
        return group.id
      })

      return groupIds
    })
}


const fetchGroupProperties = (brand, account, groupIds) => {
  return Promise.all( groupIds.map( group => {
    return fetchHostIds(brand, account, group)
      .then( ({data}) => {
        const promises = data.map( id => fetchHost(brand,account,group,id) )
        return Promise.all( promises )
      }).then( hostData => {
        //flatten data.data
        const data = hostData.map( item => item.data)
        return data
      })
  }))
  .then( (allData) => {
    //merge host / group to single array
    const merged = allData.reduce( (merge, group) => {
      return merge.concat(group)
    }, [])

    return merged
  })
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
