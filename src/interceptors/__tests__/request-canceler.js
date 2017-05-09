jest.unmock('../request-canceler.js')

import axios from 'axios'
import requestCanceler from '../request-canceler.js'

xdescribe('requestCanceler', () => {
  const expectedPublicMethods = [
    'applyInterceptor',
    'removeInterceptor',
    'cancelPendingRequests'
  ]

  beforeEach(() => {

  })

  it('should be en object', () => {
    expect(requestCanceler).toBeInstanceOf(Object)
  })
  it(`should have public methods: ${expectedPublicMethods}`, () => {
    const publicMethods = Object.keys(requestCanceler)

    expect(publicMethods.length).toEqual(expectedPublicMethods.length)
    expect(Array.prototype.includes.apply(publicMethods, expectedPublicMethods)).toBeTruthy()
  })

  describe('applyInterceptor', () => {
    const instance = axios.create()
    const method = requestCanceler.applyInterceptor


    it('optionally accept axios instance as argument', () => {
      expect(method(instance)).toBeUndefined()
    })
    it('use axios by default if no instance provided', () => {

    })
  })
})
