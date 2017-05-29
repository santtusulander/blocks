import * as api from './api'

import { actionTypes } from '../'
import { getPayload } from '../action-creators'

/**
 * Action for fetching file error report
 * @param  {String} [requestTag='storageMetrics'] request tag for tracking the request
 * @param  {[object]} requestParams               parameters for the request.
 * @return {[object]}                             action object
 */
export const fetchFileErrorMetrics = ({ requestTag = 'fileErrorMetrics', ...requestParams }) => ({

  payload: getPayload(requestTag),
  types: [actionTypes.REQUEST, actionTypes.RECEIVE, actionTypes.FAIL],
  callApi: () => api.fetchAll(requestParams)
})
