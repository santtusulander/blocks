/*TODO: UDNP-2873 remove lint disable */
/*eslint-disable no-unused-vars*/
import axios from 'axios'
import {normalize, schema} from 'normalizr'

import { BASE_URL_CIS_NORTH, buildReduxId } from '../../../util'

const baseUrl = ({ brand, account, group, id }) => {
  return `${BASE_URL_CIS_NORTH}/ingest_points/${id}?brand_id=${brand}&account_id=${account}&group_id=${group}&format=brief`
}

const baseListUrl = ({ brand, account, group, format = 'brief' }) => {
  return `${BASE_URL_CIS_NORTH}/ingest_points?brand_id=${brand}&account_id=${account}&group_id=${group}&format=${format}`
}

/* We only need profile_id -> set entity name to workflowsDummy so workflow doesn't go into redux */
const workflowSchema = new schema.Entity('workflowsDummy', {},{
  idAttribute: 'profile_id'
})

const ingestPointSchema = new schema.Entity('ingestPoints', {
  workflow: workflowSchema
},{
  idAttribute: (ingestPoint, group) => buildReduxId(group.id, ingestPoint.ingest_point_id),
  processStrategy: (value, parent) => {

    //Strip away storage_desc as it's not returned by list endpoint and not used
    const { storage_desc, ...rest } = value
    return {
      ...rest,
      parentId: parent.id,
      accountId: parent.accountId
    }
  }
})

const groupIngestPoints = new schema.Entity('groupIngestPoints', {
  ingestPoints: [ingestPointSchema]
})

/**
 * Fetch single ingestPoint
 * @param  {String} group
 * @param  {String} id
 * @return {Object} normalizr ingestPoints
 */
export const fetch = (params) => {
  return axios.get(`${baseUrl(params)}`)
    .then(({data}) => {
      return normalize({ id: params.group, accountId: params.account, ingestPoints: [ {ingest_point_id: params.id, ...data} ] }, groupIngestPoints)
    })
}

/**
 * Fetch list of ingestPoints (storage)
 * @param  {Object} params {group}
 * @return {Object} normalizr ingestPoints
 */
export const fetchAll = (params = {}) => {
  return axios.get(baseListUrl(params))
    .then(({data}) => {
      return normalize({ id: params.group, accountId: params.account, ingestPoints: data }, groupIngestPoints)
    })
}

/**
 * Create an ingestPoint
 * @param  {[type]} group
 * @return {[type]} normalizr ingestPoint
 */
export const create = ({ payload, ...params }) => {
  return axios.post(baseUrl(params), payload, { headers: { 'Content-Type': 'application/json' } })
    .then(({ data }) => {
      return normalize({ id: params.group, accountId: params.account, ingestPoints: [ {ingest_point_id: params.id, ...data } ] }, groupIngestPoints)
    })
}


/**
 * Update an ingestPoint
 * @param  {[type]} id            [description]
 * @param  {[type]} payload       [description]
 * @param  {[type]} params [description]
 * @return {[type]}               [description]
 */
export const update = ({ payload, ...params }) => {
  return Promise.reject({ data: { message: 'Update endpoint not implemented in API' } })

  // TODO: When API supports PUT
  // https://vidscale.atlassian.net/browse/CIS-322
  //
  // return axios.put(baseUrl(params), payload, { headers: { 'Content-Type': 'application/json' } })
  //   .then(({ data }) => {
  //     return normalize({ id: params.group, ingestPoints: [ {ingest_point_id: params.id, ...data } ] }, groupIngestPoints)
  //   })
}

/**
 * Update an ingestPoint
 * @param  {[type]} id            [description]
 * @param  {[type]} baseUrlParams [description]
 * @return {[type]}               [description]
 */
export const remove = (params) => {
  return axios.delete(baseUrl(params))
    .then(() => ({ id: buildReduxId(params.group, params.id) }))
}
