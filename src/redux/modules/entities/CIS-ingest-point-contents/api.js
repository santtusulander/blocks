import axios from 'axios'

import { BASE_URL_CIS_NORTH } from '../../../util'

const baseUrl = ({ brand, account, group, id, path = '' }) => (
  `${BASE_URL_CIS_NORTH}/ingest_points/${id}/content${path ? `/${path}` : ''}?brand_id=${brand}&account_id=${account}&group_id=${group}&page_size=100&offset=0&sort_order=asc`
)

export const fetch = (params = {}) => {
  return axios.get(baseUrl(params))
    .then(({data}) => {
      return { ingestPointContents: data }
    })
}
