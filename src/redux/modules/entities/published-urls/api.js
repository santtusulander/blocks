import axios from 'axios'
import {normalize, schema} from 'normalizr'
import { Map } from 'immutable'

import { BASE_URL_NORTH, buildReduxId } from '../../../util'

const publishedUrlSchema = new schema.Entity('publishedUrls', {}, {})

const ALLOWED_SCHEMAS = ['http', 'https']

export const create = ({payload, brand, account, group}) => {
  
  //Shchema of payload
  //  const payload = {
  //   ingest_points: [
  //     {
  //       ingest_point_id: "video",
  //       ingest_paths: ["/2982_GTM_v4asdas.pdf"]
  //     }
  //   ]
  // }

  return axios.post(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/published_urls`, payload, { headers: { 'Content-Type': 'application/json' }})
    .then((resp) => {

      const [ingest_point] = resp.data.ingest_points

      //get downloadUrls
      /* NOTE: Casting to Map to be able to map object-keys easily */
      const downloadUrls = Map(ingest_point.ingest_urls.protocols).reduce((acc, val, key) => {
        if (ALLOWED_SCHEMAS.includes(key)) {
          acc.push(...val.urls)
        }
        return acc
      }, [])

      //get publishedUrls
      /* NOTE: Casting to Map to be able to map object-keys easily */
      const publishedUrls = ingest_point.published_urls.reduce((acc, val) => {
        const urls = Map(val.services).reduce((urlAcc, service) => {
          if (service.urls.length > 0) {
            urlAcc.push(...service.urls)
          }

          return urlAcc
        }, [])

        if (urls.length > 0) {
          acc.push(...urls)
        }

        return acc
      }, [])


      const id = buildReduxId(brand,account,group,ingest_point.ingest_point_id, ingest_point.ingest_paths.join(''))

      const normalized = normalize({id, downloadUrls, publishedUrls }, publishedUrlSchema)

      return normalized
    })
}
