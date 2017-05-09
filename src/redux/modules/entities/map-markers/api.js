//import axios from 'axios'
import {normalize, schema} from 'normalizr'

const markerMockData = [
  {
    id: 'Core1',
    type: 'core1',
    label: 'Pop 1',
    lat: 60.192059,
    lng: 24.945831,
    traffic: 12334234
  },

  {
    id: 'pop2',
    type: 'pop',
    label: 'Pop 2',
    lat: 60.292059,
    lng: 24.845831,
    traffic: 78923423
  },

  {
    id: 'sp-edge1',
    type: 'sp-edge',
    label: 'SP Edge 1',
    lat: 60.192059,
    lng: 24.945831,
    traffic: 12334234
  },

  {
    id: 'pop2',
    type: 'pop',
    label: 'Pop 2',
    lat: 60.292059,
    lng: 24.845831,
    traffic: 78923423
  }
]

const markerSchema = new schema.Entity('mapMarkers', {},{})

// TODO: remove mock data when api is ready
//
// import { BASE_URL_CIS_SOUTH } from '../../../util'
//
// const baseUrl = () => {
//   return `${BASE_URL_CIS_SOUTH}/clusters?format=brief`
// }

/**
 * Fetch list of Markers
 * @return {Object} normalized list of markers
 */
export const fetchAll = () => {

  const data = markerMockData

  return normalize(data, [markerSchema])

  // return axios.get(baseUrl())
  // .then(({data}) => {
  //   return normalize(data, [ markerSchema ])
  // })
}
