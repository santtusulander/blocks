jest.unmock('../request-canceler.js')

import axios from 'axios'
import {
  applyInterceptor,
  refreshCancelTokenSource,
  cancelPendingRequests
} from '../request-canceler.js'

describe('requestCanceler', () => {


  describe('applyInterceptor', () => {

    beforeEach(() => {
      axios.CancelToken.source = jest.fn().mockImplementation(() => ({
        cancel: jest.fn()
      }))
    })

    let requestInterceptors = axios.interceptors.request.handlers
    let responseInterceptors = axios.interceptors.response.handlers

    it('should add interceptors to the axios instance', () => {
      applyInterceptor()

      expect(requestInterceptors.length).toEqual(1)
      expect(responseInterceptors.length).toEqual(1)
    })

    it('refreshCancelTokenSource should init new cancelToken source', () => {
      refreshCancelTokenSource()
      expect(axios.CancelToken.source).toBeCalled()
    })
  })
})
