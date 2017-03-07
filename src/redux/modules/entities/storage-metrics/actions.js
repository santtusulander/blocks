import * as api from './api'

import { actionTypes, metricsActionTypes } from '../'
import { getPayload } from '../action-creators'

/**
 * Action for fetching metrics for storages
 * @param  {String} [requestTag='storageMetrics'] request tag for tracking the request
 * @param  {[object]} requestParams               parameters for the request.
 * @return {[object]}                             action object
 */
export const fetchMetrics = ({ requestTag = 'storageMetrics', ...requestParams }) => ({

  payload: getPayload(requestTag),
  types: [actionTypes.REQUEST, metricsActionTypes.RECEIVE_METRICS, actionTypes.FAIL],
  callApi: () => api.fetch(requestParams)

})

/**
 * Action for fetching comparison metrics for storages
 * @param  {String} [requestTag='storageMetrics'] request tag for tracking the request
 * @param  {[object]} requestParams               parameters for the request.
 * @return {[object]}                             action object
 */
export const fetchComparisonMetrics = ({ requestTag = 'storageComparisonMetrics', ...requestParams }) => ({

  payload: getPayload(requestTag),
  types: [actionTypes.REQUEST, metricsActionTypes.RECEIVE_COMPARISON_METRICS, actionTypes.FAIL],
  callApi: () => api.fetch(requestParams)

})
