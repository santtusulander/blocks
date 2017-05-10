import axios from 'axios'
import {normalize, schema} from 'normalizr'

import { BASE_URL_CIS_NORTH, buildReduxId } from '../../../util'

const baseUrl = ({ brand, account, group, id, path = '' }) => (
  `${BASE_URL_CIS_NORTH}/ingest_points/${id}/content${path ? `/${path}` : ''}?brand_id=${brand}&account_id=${account}&group_id=${group}&page_size=1000&offset=0&sort_order=asc`
)

const ingestPointContentSchema = new schema.Entity('ingestPointContents', {},{
  idAttribute: (contents, storage) => buildReduxId(storage.group, storage.id),
  processStrategy: (value) => (
    value.items.map((item) => (
      {
        name: item.name,
        size: item.stat.size,
        type: item.stat.type,
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
  return axios.get(baseUrl(params))
  .then(({data}) => {
    return normalize({ group: params.group, id: params.id , contents: data }, [ ingestPointContentSchema ])
  })
}
