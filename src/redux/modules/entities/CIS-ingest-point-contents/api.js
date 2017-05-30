import axios from 'axios'
import {normalize, schema} from 'normalizr'

import { BASE_URL_CIS_NORTH, buildReduxId } from '../../../util'

const baseUrl = ({ brand, account, group, id, path = '' }, extraParams = '') => (
  `${BASE_URL_CIS_NORTH}/ingest_points/${id}/content${path ? `/${path}` : ''}?brand_id=${brand}&account_id=${account}&group_id=${group}${extraParams}`
)

const ingestPointContentSchema = new schema.Entity('ingestPointContents', {},{
  idAttribute: (contents, storage) => buildReduxId(storage.group, storage.id, storage.path || ''),
  processStrategy: (value) => (
    value.items.map((item) => (
      {
        name: item.name,
        size: item.stat.size,
        type: item.stat.type,
        created: item.stat.atime,
        lastModified: item.stat.mtime
      }
    ))
  )
})

/**
 * Fetch list of Contents
 * @return {Object} normalzed list of contents
 */
export const fetchAll = (params) => {
  return axios.get(baseUrl(params, '&page_size=1000&offset=0&sort_order=asc'))
  .then(({data}) => {
    return normalize({ group: params.group, id: params.id, path: params.path , contents: data }, [ ingestPointContentSchema ])
  })
}

export const remove = (params) => {
  const {brand, account, group, storage, splat, fileName} = params
  const reduxID = buildReduxId(group, storage, splat || '')

  const deleteParams = {
    brand,
    account,
    group,
    id: storage,
    path: splat ? `${splat}/${fileName}` : fileName
  }

  //Because API return empty response body, we have to return {reduxID, fileName} for reducers
  //TODO: use API response when API is ready
  return axios.delete(baseUrl(deleteParams))
    .then(() => ({reduxID, fileName}))
}

/**
 * Create a new folder
 * @param {Object} params
 */
export const create = (params) => {
  const {brand, account, group, storage, splat, folderName} = params

  const newFolderParams = {
    brand,
    account,
    group,
    id: storage,
    path: splat ? `${splat}/${folderName}` : folderName
  }

  return axios.post(baseUrl(newFolderParams), {},  { headers: { 'Content-Type': 'application/json' }})
}
