import axios from 'axios'
import {normalize, schema} from 'normalizr'

import { BASE_URL_CIS_NORTH, buildReduxId } from '../../../util'

const baseUrl = ({ brand, account, group, id, path = '' }) => (
  `${BASE_URL_CIS_NORTH}/ingest_points/${id}/content${path ? `/${path}` : ''}?brand_id=${brand}&account_id=${account}&group_id=${group}&page_size=1000&offset=0&sort_order=asc`
)

const ingestPointContentSchema = new schema.Entity('ingestPointContents', {},{
  idAttribute: (contents, storage) => buildReduxId(storage.group, storage.id, storage.path || ''),
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

const mockData = {
  "offset": 0,
  "page_size": 50,
  "stat": {"atime": 1491277462,
    "mode": 509,
    "mtime": 1491277462,
    "size": 52,
    "type": "directory"},
  "items": [
    {"name": "dir1",
      "stat": {"atime": 1491277462,
        "mode": 509,
        "mtime": 1491277462,
        "size": 6,
        "type": "directory"}},
    {"name": "dir2",
      "stat": {"atime": 1491277462,
        "mode": 509,
        "mtime": 1491277462,
        "size": 6,
        "type": "directory"}}
    // {"name": "file1",
    //   "stat": {"atime": 1491277462,
    //     "mode": 436,
    //     "mtime": 1491277462,
    //     "size": 100,
    //     "type": "file"}},
    // {"name": "file2",
    //   "stat": {"atime": 1491277462,
    //     "mode": 436,
    //     "mtime": 1491277462,
    //     "size": 100,
    //     "type": "file"}}
  ]
}

/**
 * Fetch list of Contents
 * @return {Object} normalzed list of contents
 */
export const fetchAll = (params) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 200)
  }).then(() => {
    return normalize({ group: params.group, id: params.id, path: params.path , contents: mockData }, [ ingestPointContentSchema ])
  })
  // return axios.get(baseUrl(params))
  // .then(({data}) => {
  //   return normalize({ group: params.group, id: params.id, path: params.path , contents: data }, [ ingestPointContentSchema ])
  // })
}
