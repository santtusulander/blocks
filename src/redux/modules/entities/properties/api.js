import axios from 'axios'
import { BASE_URL_NORTH, BASE_URL_AAA }  from '../../../util.js'
import { Schemas } from '../schemas'
import { normalize } from 'normalizr'

//export const propertySchema = new schema.Entity('properties', {idAttribute: 'published_host_id'})

/**
 * Fetch single host and normalize
 * @param  {String} brand   brand (udn)
 * @param  {Number} account account id
 * @param  {Number} group   group id
 * @param  {String} id      published_host_id
 * @return {Object}         normalized API response
 */
export const fetch = (brand, account, group, id) => {
  return fetchHost(brand, account, group, id)
    .then( ({data}) => normalize(data, Schemas.property ) )
}

/**
 * Fetch All host ids of a group
 * @param  {String} brand   brand (udn)
 * @param  {Number} account account id
 * @param  {Number} group   group id (optional, if not provided fetches all groups for an account)
 * @return {Object}         normalized API response
 */
export const fetchAll = (brand, account, group) => {
  return fetchHostIds(brand, account, group)
    .then( ({data}) => {
      //const objs = data.map( val => ({published_host_id: val}) )

/*      const objs = {
        id: group,
        properties: data.data
      }*/
      return normalize(data, Schemas.groupProperties)
    })
}


/**
 * Get all hosts and their details for an account or group
 * @param  {String} brand   brand Id
 * @param  {Number} account account Id
 * @param  {Number} group   groupId
 * @return {Object} Merged / Normalized API response
 */
export const fetchAllWithDetails = (brand, account, group) => {
  return getGroupIds(brand, account, group)
    .then(groups => {
      return fetchGroupProperties(brand, account, groups)
    })
    .then( data => {
      const hostData = {
        id: group,
        properties: data
      }

      const normalized = normalize(hostData, Schemas.groupProperties)

      return normalized
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
/**
 * Helper to get groups for an account or return current group, if provided
 * @param  {String} brand   [description]
 * @param  {Number} account [description]
 * @param  {Number} group   [description]
 * @return {Array}          Array of group id(s)
 */
const getGroupIds = (brand, account, group) => {
  let groupIds = []
  if (group) {
    groupIds.push(group)
    return Promise.resolve(groupIds)
  } else {
    return fetchGroupsIds(brand, account)
  }
}
