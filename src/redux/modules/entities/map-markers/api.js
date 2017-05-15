import axios from 'axios'
import {normalize, schema} from 'normalizr'

import { BASE_URL_NORTH, PAGINATION_MOCK } from '../../../util'
import { UDN_CORE_ACCOUNT_ID } from '../../../../constants/account-management-options'

const markerSchema = new schema.Entity('mapMarkers', {},{
  processStrategy: (value) => {

    const type = (value.account_id === UDN_CORE_ACCOUNT_ID) ? 'core' : 'edge'

    return {
      ...value,
      latlng: [value.lat, value.lon],
      lnglat: [value.lon, value.lat],
      type
    }
  }
})

export const fetchAll = () => {
  return Promise.all([
    fetchLocations(),
    fetchResources()
  ]).then(([locations, resources]) => {

    const combined = locations.map(loc => {

      if (loc.account_id !== UDN_CORE_ACCOUNT_ID) {
        const resource = resources.find(res => {
          return (
            res.account_id === loc.account_id
            && res.group_id === loc.group_id
            && res.iata === loc.iata_code
          )
        })

        if (!resource) {
          /* eslint-disable no-console */
          console.warn('Location ', loc.id, ' could not be combined with resource')
          /* eslint-enable no-console */
          return undefined
        }

        return {
          ...loc,
          iata_code: resource.iata,
          resourceIata: resource.iata
        }
      } else {
        return loc
      }
    })

    return normalize(combined, [ markerSchema ])

  })
}

/**
 * Fetch list of Markers
 * @return {Object} normalized list of markers
 */
export const fetchLocations = () => {

  return axios.get(`${BASE_URL_NORTH}/locations`, PAGINATION_MOCK)
  .then(({data}) => {
    return data.data
  })
}

/**
 * Fetch All resources
 * @return {[type]} [description]
 */
export const fetchResources = () => {
  return axios.get(`${BASE_URL_NORTH}/brands/udn/resources`, PAGINATION_MOCK)
  .then(({data}) => {
    return data
    //return normalize(data.data, [ markerSchema ])
  })
}
