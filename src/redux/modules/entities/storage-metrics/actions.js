import * as api from './api'

import { actionTypes } from '../'
import { getPayload } from '../action-creators'

export default ({ requestTag = 'storageMetrics', comparison, ...requestParams }) => ({

  payload: getPayload(requestTag),
  types: [actionTypes.REQUEST, actionTypes.RECEIVE, actionTypes.FAIL],
  callApi: () => api.fetch(requestParams, comparison)

})
