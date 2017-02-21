import axios from 'axios'

import { parseResponseData, qsBuilder } from '../redux/util'
import { MAPBOX_REVERSE_LOOKUP_ENDPOINT } from '../constants/mapbox.js'
import { RIPE_STAT_DATA_API_ENDPOINT } from '../constants/network'

const ripeInstance = axios.create({
  baseURL: RIPE_STAT_DATA_API_ENDPOINT
})

ripeInstance.interceptors.request.use(config => {
  delete config.headers['X-Auth-Token']
  return config
})

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

/**
 * Fetch AS-overview
 * @param resource
 */
export const fetchASOverview = resource => CallRIPEStatDataAPI('as-overview', { resource })

/**
 * Helper to make calls to RIPE Stat Data API
 * @param dataCallName
 * @param params
 * @param format
 * @returns {axios.Promise}
 * @constructor
 */
const CallRIPEStatDataAPI = (dataCallName, params = {}, format = 'json') => {
  // TODO: Should we include the sourceapp-param
  // as described in https://stat.ripe.net/docs/data_api#RulesOfUsage

  // const finalParams = Object.assign({}, params, { sourceapp: 'udnportal' })
  const query = qsBuilder(params)
  return ripeInstance.get(`/${dataCallName}/data.${format}${query}`).then(parseResponseData)
}

/**
 * Generate nodename
 * @param  {String} pod_id
 * @param  {String} iata
 * @param  {String} serverNumber
 * @param  {String} node_role
 * @param  {String} node_env
 * @param  {String} domain
 * @return {String}
 */
export const generateNodeName = ({pod_id, iata, serverNumber, node_role, node_env, domain} ) => {
  let envDomain = `${node_env}.${domain}`

  //environment should be blank for prod
  if (node_env === 'production') {
    envDomain = `${domain}`
  }

  if ( node_role === 'cache') {
    return `large.${pod_id}.cache${serverNumber}.${iata}.${envDomain}`
  } else if (node_role === 'gslb') {
    return `gslb.${pod_id}.ns${serverNumber}.par.${envDomain}`
  } else if (node_role === 'slb') {
    return `slb.${pod_id}.ns${serverNumber}.par.${envDomain}`
  }

  return `unknown.${envDomain}`
}
