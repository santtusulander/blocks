import * as api from './api'

import { actionTypes, contentsActionTypes } from '../'
import { getPayload } from '../action-creators'

/**
 * Action for fetching content for storages
 * @param  {String} [requestTag='ingestPointContents'] request tag for tracking the request
 * @param  {[object]} requestParams               parameters for the request.
 * @return {[object]}                             action object
 */
export const fetchContent = ({ requestTag = 'ingestPointContents', ...requestParams }) => ({

  payload: getPayload(requestTag),
  types: [actionTypes.REQUEST, contentsActionTypes.RECEIVE_CONTENTS, actionTypes.FAIL],
  callApi: () => api.fetch(requestParams)

})
