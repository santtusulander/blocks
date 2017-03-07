import * as api from './api'

import { actionTypes } from '../'
import { getPayload } from '../action-creators'

/**
 * Action for fetching metrics for storages
 * @param  {String} [requestTag='storageMetrics'] request tag for tracking the request
 * @param  {[boolean]} comparison                 true if fetching for comparison data. Results in a 'comparison' prefix in redux ID.
 * @param  {[object]} requestParams               parameters for the request.
 * @return {[object]}                             action object
 */
export default ({ requestTag = 'storageMetrics', comparison, ...requestParams }) => ({

  payload: getPayload(requestTag),
  types: [actionTypes.REQUEST, actionTypes.RECEIVE, actionTypes.FAIL],
  callApi: () => api.fetch(requestParams, comparison)

})
