import axios from 'axios'

import { parseResponseData } from '../redux/util'
import { MAPBOX_REVERSE_LOOKUP_ENDPOINT } from '../constants/mapbox.js'


/**
 * Helper to make calls to MapBox Reverse-Geocoding API
 *
 * @param lon - longitude
 * @param lan - latitude
 * @param limit - limit number of results
 * @param mode - mapbox.places or mapbox.places-permanent for enterprise/batch
 *
 * @returns {axios.Promise}
 *
 */
export const locationReverseGeoCodingLookup = (lon, lat, limit = 1, mode = 'mapbox.places') => {
  const url = `${MAPBOX_REVERSE_LOOKUP_ENDPOINT}/${mode}/${lon},${lat}.json?limit=${limit}&access_token=${MAPBOX_ACCESS_TOKEN}`

  return axios.get(url).then(parseResponseData)
}
