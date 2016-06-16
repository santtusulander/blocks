import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

import { mapReducers } from '../util'

const SECURITY_SSL_CERTIFICATES_FETCH = 'SECURITY_SSL_CERTIFICATES_FETCH'
const DOMAIN_CREATED = 'DOMAIN_CREATED'
const CHANGE_ACTIVE_DOMAIN = 'CHANGE_ACTIVE_DOMAIN'
const CHANGE_ACTIVE_RECORD_TYPE = 'CHANGE_ACTIVE_RECORD_TYPE'

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
        {id: 1, title: 'SSL 1', commonName: '*.ufd.net', group: 'group 1'},
        {id: 2, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 'group 3'},
        {id: 3, title: 'SSL 1', commonName: '*.ufd.net', group: 'group 1'},
        {id: 4, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 'group 3'},
        {id: 5, title: 'SSL 1', commonName: '*.ufd.net', group: 'group 1'}
    ]
  },
  {
    account: 3,
    items: [
        {id: 1, title: 'SSL 1', commonName: '*.ufd.net', group: 'group 1'},
        {id: 2, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 'group 3'},
        {id: 3, title: 'SSL 1', commonName: '*.ufd.net', group: 'group 1'},
        {id: 4, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 'group 3'}
    ]
  },
  {
    account: 2,
    items: [
        {id: 1, title: 'SSL 1', commonName: '*.ufd.net', group: 'group 1'},
        {id: 2, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 'group 3'},
        {id: 3, title: 'SSL 1', commonName: '*.ufd.net', group: 'group 1'}
    ]
  }
]

export const initialState = fromJS({
  fetching: false,
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


export default handleActions({
  SECURITY_SSL_CERTIFICATES_FETCH: mapReducers(fetchSSLCertificatesSuccess, fetchSSLCertificatesFailure)
}, initialState)

// ACTIONS

export const fetchSSLCertificates = createAction(SECURITY_SSL_CERTIFICATES_FETCH, () => {
  return new Promise(res => res(fakeSSLCertificates))
})
export const createDomain = createAction(DOMAIN_CREATED)
export const changeActiveDomain = createAction(CHANGE_ACTIVE_DOMAIN)
export const changeActiveRecordType = createAction(CHANGE_ACTIVE_RECORD_TYPE)

