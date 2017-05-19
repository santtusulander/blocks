import axios from 'axios'
//import {normalize, schema} from 'normalizr'

import { BASE_URL_NORTH } from '../../../util'

// const serviceTitleSchema = new schema.Entity('serviceTitles', {}, {
//   idAttribute: 'name'
// })

export const create = ({payloadX, brand, account, group}) => {
  const payload = {
    ingest_points: [
      {
        ingest_point_id: "video",
        ingest_paths: ["fold/subfold/mike-third-test.png"]
      }
    ]
  }

  return axios.post(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/group/${group}/published_urls`, payload, { headers: { 'Content-Type': 'application/json' }})
    .then((resp) => {
      console.log('publishedUrls', resp);
    })
}
