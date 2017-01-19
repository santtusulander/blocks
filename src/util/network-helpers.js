import axios from 'axios'

import { parseResponseData, qsBuilder } from '../redux/util'
import { RIPE_STAT_DATA_API_ENDPOINT } from '../constants/network'

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
  return axios.get(`${RIPE_STAT_DATA_API_ENDPOINT}/${dataCallName}/data.${format}${query}`)
    .then(parseResponseData)
}
