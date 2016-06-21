import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

import { mapReducers } from '../util'

const SECURITY_SSL_CERTIFICATES_FETCH = 'SECURITY_SSL_CERTIFICATES_FETCH'
const SECURITY_ACTIVE_CERTIFICATES_TOGGLED = 'SECURITY_ACTIVE_CERTIFICATES_TOGGLED'
const SECURITY_SSL_CERTIFICATES_UPLOAD = 'SECURITY_SSL_CERTIFICATES_UPLOAD'
const SECURITY_SSL_CERTIFICATES_DELETE = 'SECURITY_SSL_CERTIFICATES_DELETE'
const SECURITY_SSL_CERTIFICATES_EDIT = 'SECURITY_SSL_CERTIFICATES_EDIT'
const SECURITY_SSL_CERTIFICATE_TO_EDIT_CHANGED = 'SECURITY_SSL_CERTIFICATE_TO_EDIT_CHANGED'


const fakeSSLCertificates = fromJS([
  {
    account: 25,
    items: [
      {id: 1, title: 'SSL 1', commonName: '*.ufd.net', group: 1},
      {id: 2, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 3},
      {id: 3, title: 'SSL 1', commonName: '*.ufd.net', group: 1},
      {id: 4, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 3},
      {id: 5, title: 'SSL 1', commonName: '*.ufd.net', group: 1},
      {id: 6, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 3}
    ]
  },
  {
    account: 1,
    items: [
        {id: 7, title: 'SSL 1', commonName: '*.ufd.net', group: 1},
        {id: 8, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 3},
        {id: 9, title: 'SSL 1', commonName: '*.ufd.net', group: 1},
        {id: 10, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 3},
        {id: 11, title: 'SSL 1', commonName: '*.ufd.net', group: 1}
    ]
  },
  {
    account: 3,
    items: [
        {id: 12, title: 'SSL 1', commonName: '*.ufd.net', group: 1},
        {id: 13, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 3},
        {id: 14, title: 'SSL 1', commonName: '*.ufd.net', group: 1},
        {id: 15, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 3}
    ]
  },
  {
    account: 2,
    items: [
        {id: 16, title: 'SSL 1', commonName: '*.ufd.net', group: 1},
        {id: 17, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 3},
        {id: 18, title: 'SSL 1', commonName: '*.ufd.net', group: 1}
    ]
  }
])

export const initialState = fromJS({
  fetching: false,
  editingCertificate: null,
  activeCertificates: [],
  sslCertificates: {
  }
})

// REDUCERS

export function fetchSSLCertificatesSuccess(state, action) {
  const sslCertificates = fakeSSLCertificates.find(item => item.get('account') === action.payload.account)
  return state.merge({ sslCertificates })
}

export function fetchSSLCertificatesFailure(state) {
  return state.merge({
    fetching: false
  })
}

export function uploadSSLCertificateSuccess(state, action) {
  action.payload.account = Math.floor(Math.random() * 500) + 100
  const updatedItems = state.getIn(['sslCertificates', 'items']).push(action.payload)
  return state.merge({ sslCertificates: state.get('sslCertificates').merge({ items: updatedItems }) })
}

export function deleteSSLCertificateSuccess(state) {
  const toEdit = state.get('editingCertificate')
  const items = state.getIn(['sslCertificates', 'items'])
  const updatedItems = items.delete(items.findIndex(item => item.get('id') === toEdit))
  return state.merge({
    editingCertificate: null,
    sslCertificates: state.get('sslCertificates').merge({ items: updatedItems }) })
}

export function uploadSSLCertificateFailure(state) {
  return state.merge({
    fetching: false
  })
}

export function deleteSSLCertificateFailure(state) {
  return state.merge({
    fetching: false
  })
}

export function certificateToEditChanged(state, action) {
  return state.merge({ editingCertificate: action.payload })
}

export function editSSLCertificateSuccess(state, action) {
  const toEdit = state.get('editingCertificate')
  const items = state.getIn(['sslCertificates', 'items'])
  const updatedItems = items.update(
    items.findIndex(item => item.get('id') === toEdit),
    item => item.merge(action.payload))
  return state.merge({
    editingCertificate: null,
    sslCertificates: state.get('sslCertificates').merge({ items: updatedItems }) })
}

export function editSSLCertificateFailure(state) {
  return state.merge({
    fetching: false
  })
}

export function activeCertificatesToggled(state, action) {
  let newActiveCertificates = state.get('activeCertificates')
  newActiveCertificates =  newActiveCertificates.includes(action.payload) ?
    newActiveCertificates.filter(id => id !== action.payload) :
    newActiveCertificates.push(action.payload)
  return state.set('activeCertificates', newActiveCertificates)
}

export default handleActions({
  SECURITY_SSL_CERTIFICATES_FETCH: mapReducers(fetchSSLCertificatesSuccess, fetchSSLCertificatesFailure),
  SECURITY_ACTIVE_CERTIFICATES_TOGGLED: activeCertificatesToggled,
  SECURITY_SSL_CERTIFICATES_UPLOAD: mapReducers(uploadSSLCertificateSuccess, uploadSSLCertificateFailure),
  SECURITY_SSL_CERTIFICATES_DELETE: mapReducers(deleteSSLCertificateSuccess, deleteSSLCertificateFailure),
  SECURITY_SSL_CERTIFICATES_EDIT: mapReducers(editSSLCertificateSuccess, editSSLCertificateFailure),
  SECURITY_SSL_CERTIFICATE_TO_EDIT_CHANGED: certificateToEditChanged
}, initialState)

// ACTIONS
export const uploadSSLCertificate = createAction(SECURITY_SSL_CERTIFICATES_UPLOAD, opts => {
  return new Promise(res => res(opts))
})

export const deleteSSLCertificate = createAction(SECURITY_SSL_CERTIFICATES_DELETE, opts => {
  return new Promise(res => res(opts))
})

export const editSSLCertificate = createAction(SECURITY_SSL_CERTIFICATES_EDIT, opts => {
  return new Promise(res => res(opts))
})

export const changeCertificateToEdit = createAction(SECURITY_SSL_CERTIFICATE_TO_EDIT_CHANGED)

export const fetchSSLCertificates = createAction(SECURITY_SSL_CERTIFICATES_FETCH, opts => {
  return new Promise(res => res(opts))
})

export const toggleActiveCertificates = createAction(SECURITY_ACTIVE_CERTIFICATES_TOGGLED, opts => {
  return new Promise(res => res(opts))
})

