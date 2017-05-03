import axios, { CancelToken } from 'axios'

export default new class RequestCanceler {
  /**
   * Add cancelToken to config
   * @param {Promise} cancelToken - axios cancelToken
   * @return {function} configDecorator
   */
  static setCancelToken(cancelToken) {
    return function configDecorator(config) {
      return {...config, cancelToken}
    }
  }

  constructor() {
    // eslint-disable-next-line no-shadow
    const {cancel, token} = CancelToken.source()
    this.interceptor = null
    this.instance = null

    this.getCanceler = () => cancel
    this.getToken = () => token
  }

  /**
   * Apply interceptor with cancelToken
   * @param instance - instance of axios
   */
  applyCanceler(instance = axios) {
    const token = this.getToken()
    this.instance = instance

    // Apply interceptor and save it's id
    this.interceptor = instance.interceptors.request.use(RequestCanceler.setCancelToken(token))
  }

  /**
   * Cancel requests
   */
  cancelPending() {
    this.getCanceler()()
  }

  /**
   * Eject cancel interceptor
   * @param interceptor
   */
  removeCanceler() {
    this.instance.interceptors.request.eject(this.interceptor)
  }
}
