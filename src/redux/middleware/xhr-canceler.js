import { USER_LOGGED_IN, USER_LOGGED_OUT } from './../modules/user'
import requestCanceler from '../../interceptors/request-canceler'

const {
  applyInterceptor,
  refreshCancelTokenSource,
  cancelPendingRequests } = requestCanceler

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
