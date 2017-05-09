import axios, { CancelToken, isCancel } from 'axios'

let source = null

/* Set axios by default */
let axiosInstance = axios

const refreshCancelTokenSource = function () {
  source = CancelToken.source()
}

/**
 * Decorate config with axios cancelToken
 * @param {Object} config - axios config
 * @return {Object} - decorated config
 */
const configDecorator = function (config) {
  return source ? { ...config, cancelToken: source.token } : config
}

/**
 * Failure handler
 * @param {Object} error - failed response
 * @return {Promise.<*>}
 */
const rejectHandler = function (error) {
  return isCancel(error) ? error : Promise.reject(error)
}

/**
 * Apply request and response interceptors to axios instance
 * @param {Object} instance
 */
const applyInterceptor = function (instance) {
  if (instance) {
    axiosInstance = instance
  }
  axiosInstance.interceptors.request.use(configDecorator)
  axiosInstance.interceptors.response.use(response => response, rejectHandler)
}

/**
 * Cancel requests by resolving cancelToken Promise
 */
const cancelPendingRequests = () => {
  source.cancel('cancelled')
}

export default {
  applyInterceptor,
  cancelPendingRequests,
  refreshCancelTokenSource
}
