import axios from 'axios'
import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

import { mapReducers, urlBase, parseResponseData } from '../util'

const SECURITY_SSL_CERTIFICATES_FETCH = 'SECURITY_SSL_CERTIFICATES_FETCH'
const SECURITY_ACTIVE_CERTIFICATES_TOGGLED = 'SECURITY_ACTIVE_CERTIFICATES_TOGGLED'
const SECURITY_SSL_CERTIFICATES_UPLOAD = 'SECURITY_SSL_CERTIFICATES_UPLOAD'
const SECURITY_SSL_CERTIFICATES_DELETE = 'SECURITY_SSL_CERTIFICATES_DELETE'
const SECURITY_SSL_CERTIFICATES_EDIT = 'SECURITY_SSL_CERTIFICATES_EDIT'
const SECURITY_SSL_CERTIFICATE_TO_EDIT_CHANGED = 'SECURITY_SSL_CERTIFICATE_TO_EDIT_CHANGED'


const fakeSSLCertificates = fromJS([
  {account: 1, id: 1, title: 'SSL 1', commonName: '*.ufd.net', group: 1},
  {account: 2, id: 2, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 3},
  {account: 3, id: 3, title: 'SSL 1', commonName: '*.ufd.net', group: 1},
  {account: 4, id: 4, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 3},
  {account: 5, id: 5, title: 'SSL 1', commonName: '*.ufd.net', group: 1},
  {account: 6, id: 6, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 3},
  {account: 25, id: 7, title: 'SSL 1', commonName: '*.ufd.net', group: 1},
  {account: 2, id: 8, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 3},
  {account: 3, id: 9, title: 'SSL 1', commonName: '*.ufd.net', group: 1},
  {account: 4, id: 10, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 3},
  {account: 5, id: 11, title: 'SSL 1', commonName: '*.ufd.net', group: 1},
  {account: 25, id: 12, title: 'SSL 1', commonName: '*.ufd.net', group: 1},
  {account: 1, id: 13, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 3},
  {account: 2, id: 14, title: 'SSL 1', commonName: '*.ufd.net', group: 1},
  {account: 3, id: 15, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 3},
  {account: 25, id: 16, title: 'SSL 1', commonName: '*.ufd.net', group: 1},
  {account: 5, id: 17, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 3},
  {account: 6, id: 18, title: 'SSL 1', commonName: '*.ufd.net', group: 1}
])

export const initialState = fromJS({
  fetching: false,
  certificateToEdit: null,
  activeCertificates: [],
  sslCertificates: []
})

// REDUCERS

export function fetchSSLCertificatesSuccess(state, action) {
  return state.merge({ sslCertificates: state.get('sslCertificates').merge(action.payload) })
}

export function fetchSSLCertificatesFailure(state) {
  return state.merge({
    fetching: false
  })
}

export function uploadSSLCertificateSuccess(state, action) {
  const sslCertificates = state.get('sslCertificates')
  return state.merge({ sslCertificates: sslCertificates.merge(sslCertificates.push(fromJS(action.payload))) })
}

export function deleteSSLCertificateSuccess(state) {
  const sslCertificates = state.get('sslCertificates')
  const itemIndex = sslCertificates.findIndex(item => item.get('id') === state.get('certificateToEdit'))
  return state.merge({ sslCertificates: sslCertificates.delete(itemIndex) })
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
  const { account, group, payload: { certificate } } = action
  return state.merge({ certificateToEdit: fromJS(certificate).merge({ account, group }) })
}

export function editSSLCertificateSuccess(state, action) {
  const sslCertificates = state.get('sslCertificates')
  const itemIndex = sslCertificates.findIndex(item => item.get('commonName') === state.get('certificateToEdit'))
  return state.merge({ sslCertificates: sslCertificates.update(itemIndex, item => item.merge(action.payload)) })

}

export function editSSLCertificateFailure(state) {
  return state.merge({
    fetching: false
  })
}

export function activeCertificatesToggled(state, action) {
  let newActiveCertificates = state.get('activeCertificates')
  newActiveCertificates =  newActiveCertificates.includes(action.payload) ?
    newActiveCertificates.filter(commonName => commonName !== action.payload) :
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
export const uploadSSLCertificate = createAction(SECURITY_SSL_CERTIFICATES_UPLOAD, (brand, account, group, data) => {
  return axios.post(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/certs`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(parseResponseData)
})

export const deleteSSLCertificate = createAction(SECURITY_SSL_CERTIFICATES_DELETE, opts => {
  return new Promise(res => res(opts))
})

export const editSSLCertificate = createAction(SECURITY_SSL_CERTIFICATES_EDIT, opts => {
  return new Promise(res => res(opts))
})

export const changeCertificateToEdit = createAction(SECURITY_SSL_CERTIFICATE_TO_EDIT_CHANGED, (brand, account, group, cert) => {
  return axios.get(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/certs/${cert}`, {
  }).then(response => response && { account, group, data: response.data })
})

export const fetchSSLCertificates = createAction(SECURITY_SSL_CERTIFICATES_FETCH, (brand, account, group) => {
  return axios.get(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/certs`)
    .then(
      response => response ? response.data.map(commonName => {
        return { group, commonName, account: account }
      }) : null
    )
})

export const toggleActiveCertificates = createAction(SECURITY_ACTIVE_CERTIFICATES_TOGGLED, opts => {
  return new Promise(res => res(opts))
})

