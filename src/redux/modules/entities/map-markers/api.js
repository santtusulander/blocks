import axios from 'axios'
import {normalize, schema} from 'normalizr'

import { BASE_URL_NORTH } from '../../../util'

// const markerMockData = [
//   {
//     account_id: 1,
//     boundingbox: [
//       50.027758,
//       50.057758,
//       8.5420492,
//       8.5720492
//     ],
//     brand_id: 'udn',
//     city_name: 'Frankfurt',
//     cloud_location_id: 'fra01',
//     cloud_name: 'UDN-Core',
//     cloud_provider: 'os',
//     cloud_region: 'EU',
//     country_code: 'de',
//     group_id: 6,
//     iata_code: 'fra',
//     id: 'fra01',
//     lat: 50.042758,
//     lon: 8.5570492,
//     postalcode: '123123',
//     state: 'Hesse',
//     street: 'some street address'
//   }
// ]

const markerSchema = new schema.Entity('mapMarkers', {},{})

const baseUrl = () => {
  return `${BASE_URL_NORTH}/locations`
}

/**
 * Fetch list of Markers
 * @return {Object} normalized list of markers
 */
export const fetchAll = () => {

  return axios.get(baseUrl())
  .then(({data}) => {
    return normalize(data.data, [ markerSchema ])
  })
}
