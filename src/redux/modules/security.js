import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

import { mapReducers } from '../util'

const SECURITY_SSL_CERTIFICATES_FETCH = 'SECURITY_SSL_CERTIFICATES_FETCH'
const SECURITY_ACTIVE_CERTIFICATES_TOGGLED = 'SECURITY_ACTIVE_CERTIFICATES_TOGGLED'


const fakeSSLCertificates = [
  {
    account: 25,
    items: [
      {id: 1, title: 'SSL 1', commonName: '*.ufd.net', group: 'group 1'},
      {id: 2, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 'group 3'},
      {id: 3, title: 'SSL 1', commonName: '*.ufd.net', group: 'group 1'},
      {id: 4, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 'group 3'},
      {id: 5, title: 'SSL 1', commonName: '*.ufd.net', group: 'group 1'},
      {id: 6, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 'group 3'}
    ]
  },
  {
    account: 1,
    items: [
        {id: 7, title: 'SSL 1', commonName: '*.ufd.net', group: 'group 1'},
        {id: 8, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 'group 3'},
        {id: 9, title: 'SSL 1', commonName: '*.ufd.net', group: 'group 1'},
        {id: 10, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 'group 3'},
        {id: 11, title: 'SSL 1', commonName: '*.ufd.net', group: 'group 1'}
    ]
  },
  {
    account: 3,
    items: [
        {id: 12, title: 'SSL 1', commonName: '*.ufd.net', group: 'group 1'},
        {id: 13, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 'group 3'},
        {id: 14, title: 'SSL 1', commonName: '*.ufd.net', group: 'group 1'},
        {id: 15, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 'group 3'}
    ]
  },
  {
    account: 2,
    items: [
        {id: 16, title: 'SSL 1', commonName: '*.ufd.net', group: 'group 1'},
        {id: 17, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 'group 3'},
        {id: 18, title: 'SSL 1', commonName: '*.ufd.net', group: 'group 1'}
    ]
  }
]

export const initialState = fromJS({
  fetching: false,
  activeCertificates: [],
  sslCertificates: []
})

// REDUCERS

export function fetchSSLCertificatesSuccess(state, action) {
  return state.merge({ sslCertificates: action.payload })
}

export function fetchSSLCertificatesFailure(state) {
  return state.merge({
    fetching: false
  })
}

export function uploadSSLCertificateSuccess(state) {
  return state
}

export function uploadSSLCertificateFailure(state) {
  return state.merge({
    fetching: false
  })
}

export function editSSLCertificateSuccess(state) {
  return state
}

export function editSSLCertificateFailure(state) {
  return state.merge({
    fetching: false
  })
}

export function activeCertificatesToggled(state, action) {
  return state.merge({
    activeCertificates: action.payload
  })
}

export default handleActions({
  SECURITY_SSL_CERTIFICATES_FETCH: mapReducers(fetchSSLCertificatesSuccess, fetchSSLCertificatesFailure),
  SECURITY_ACTIVE_CERTIFICATES_TOGGLED: activeCertificatesToggled
}, initialState)

// ACTIONS

export const fetchSSLCertificates = createAction(SECURITY_SSL_CERTIFICATES_FETCH, () => {
  return new Promise(res => res(fakeSSLCertificates))
})

export const toggleActiveCertificates = createAction(SECURITY_ACTIVE_CERTIFICATES_TOGGLED, opts => {
  return new Promise(res => res(opts))
})

