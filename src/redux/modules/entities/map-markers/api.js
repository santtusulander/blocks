import axios from 'axios'
import {normalize, schema} from 'normalizr'

import { BASE_URL_NORTH, PAGINATION_MOCK } from '../../../util'

const markerSchema = new schema.Entity('mapMarkers', {},{
  processStrategy: (value) => {

    const type = (value.account_id === 1) ? 'core' : 'edge'

    return {
      ...value,
      latlng: [value.lat, value.lon],
      type
    }
  }
})

const baseUrl = () => {
  return `${BASE_URL_NORTH}/locations`
}

/**
 * Fetch list of Markers
 * @return {Object} normalized list of markers
 */
export const fetchAll = () => {

  return axios.get(baseUrl(), PAGINATION_MOCK)
  .then(({data}) => {
    return normalize(data.data, [ markerSchema ])
  })
}
