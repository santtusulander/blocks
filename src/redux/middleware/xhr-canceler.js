import { USER_LOGGED_IN, USER_LOGGED_OUT } from './../modules/user'

import {
  applyInterceptor,
  refreshCancelTokenSource,
  cancelPendingRequests
} from '../../interceptors/request-canceler'

/* Apply interceptor */
applyInterceptor()

/**
 * Map of action types and canceler handlers
 * @type {{string: function}}
 */
const actionsHandlersMap = {
  [USER_LOGGED_IN]: refreshCancelTokenSource,
  [USER_LOGGED_OUT]: cancelPendingRequests
}

// eslint-disable-next-line no-unused-vars
const xhrCancelMiddleware = store => next => function xhrCancelHandler(action) {
  const { type } = action

  if (actionsHandlersMap.hasOwnProperty(type)) {
    actionsHandlersMap[type]()
  }

  return next(action)
}

export default xhrCancelMiddleware
