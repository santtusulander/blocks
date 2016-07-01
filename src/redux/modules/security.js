import axios from 'axios'
import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

import { mapReducers, urlBase } from '../util'

const SECURITY_SSL_CERTIFICATES_FETCH = 'SECURITY_SSL_CERTIFICATES_FETCH'
const SECURITY_SSL_CERTIFICATE_FETCH = 'SECURITY_SSL_CERTIFICATE_FETCH'
const SECURITY_ACTIVE_CERTIFICATES_TOGGLED = 'SECURITY_ACTIVE_CERTIFICATES_TOGGLED'
const SECURITY_SSL_CERTIFICATES_UPLOAD = 'SECURITY_SSL_CERTIFICATES_UPLOAD'
const SECURITY_SSL_CERTIFICATES_DELETE = 'SECURITY_SSL_CERTIFICATES_DELETE'
const SECURITY_SSL_CERTIFICATES_EDIT = 'SECURITY_SSL_CERTIFICATES_EDIT'
const SECURITY_SSL_CERTIFICATE_TO_EDIT_RESET = 'SECURITY_SSL_CERTIFICATE_TO_EDIT_RESET'


const fakeSSLCertificates = fromJS([
  // {account: 3, title: 'SSL 1', commonName: '*.ufd.net', group: 1},
  // {account: 4, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 3},
  // {account: 5, title: 'SSL 1', commonName: '*.ufd.net', group: 1},
  // {account: 6, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 3},
  // {account: 25, title: 'SSL 1', commonName: '*.ufd.net', group: 1},
  // {account: 2, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 3},
  // {account: 3, title: 'SSL 1', commonName: '*.ufd.net', group: 1},
  // {account: 4, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 3},
  // {account: 5, title: 'SSL 1', commonName: '*.ufd.net', group: 1},
  // {account: 25, title: 'SSL 1', commonName: '*.ufd.net', group: 1},
  // {account: 1, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 3},
  {account: 1, title: 'PLACEHOLDER SSL', cn: 'placeholder.cert', group: 1},
  {account: 2, title: 'PLACEHOLDER SSL', cn: 'placeholder.cert', group: 3}
])

export const initialState = fromJS({
  fetching: false,
  certificateToEdit: {},
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
  const { account, group, certificate } = action.payload
  const sslCertificates = state.get('sslCertificates')
  return state.merge({ sslCertificates: sslCertificates
    .merge(sslCertificates.push(fromJS(certificate).merge({ account, group })))
  })
}

export function deleteSSLCertificateSuccess(state) {
  const sslCertificates = state.get('sslCertificates')
  const itemIndex = sslCertificates.findIndex(item => item.get('cn') === state.get('certificateToEdit').get('cn'))
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

export function fetchSSLCertificateFailure(state) {
  return state.merge({
    fetching: false
  })
}

export function certificateToEditReset(state) {
  return state.merge({
    certificateToEdit: {}
  })
}

export function fetchSSLCertificateSuccess(state, action) {
  const { account, group, certificate } = action.payload
  return state.merge({ certificateToEdit: fromJS(certificate).merge({ account, group }) })
}

export function editSSLCertificateSuccess(state, action) {
  const sslCertificates = state.get('sslCertificates')
  const itemIndex = sslCertificates.findIndex(item => item.get('cn') === state.get('certificateToEdit').get('cn'))
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
  SECURITY_SSL_CERTIFICATE_FETCH: mapReducers(fetchSSLCertificateSuccess, fetchSSLCertificateFailure),
  SECURITY_ACTIVE_CERTIFICATES_TOGGLED: activeCertificatesToggled,
  SECURITY_SSL_CERTIFICATES_UPLOAD: mapReducers(uploadSSLCertificateSuccess, uploadSSLCertificateFailure),
  SECURITY_SSL_CERTIFICATES_DELETE: mapReducers(deleteSSLCertificateSuccess, deleteSSLCertificateFailure),
  SECURITY_SSL_CERTIFICATES_EDIT: mapReducers(editSSLCertificateSuccess, editSSLCertificateFailure),
  SECURITY_SSL_CERTIFICATE_TO_EDIT_RESET: certificateToEditReset
}, initialState)

// ACTIONS
export const uploadSSLCertificate = createAction(SECURITY_SSL_CERTIFICATES_UPLOAD, (brand, account, group, data) => {
  return axios.post(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/certs`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response && { account, group, certificate: response.data })
})

export const deleteSSLCertificate = createAction(SECURITY_SSL_CERTIFICATES_DELETE, (brand, account, group, cert) => {
  return axios.delete(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/certs/${cert}`)
})

export const editSSLCertificate = createAction(SECURITY_SSL_CERTIFICATES_EDIT, (brand, account, group, cert, data) => {
  return axios.put(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/certs/${cert}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response && { account, group, certificate: response.data })
})

export const fetchSSLCertificate = createAction(SECURITY_SSL_CERTIFICATE_FETCH, (brand, account, group, cert) => {
  return axios.get(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/certs/${cert}`)
    .then(response => response && { account, group, certificate: response.data })
})

export const fetchSSLCertificates = createAction(SECURITY_SSL_CERTIFICATES_FETCH, (brand, account) => {
  // return axios.get(`${urlBase}/VCDN/v2/${brand}/accounts/${account}/groups/${group}/certs`)
  //   .then(response => response && response.data.map(commonName => { return { group, commonName, account } }))
  return Promise.resolve(fakeSSLCertificates)
})

export const toggleActiveCertificates = createAction(SECURITY_ACTIVE_CERTIFICATES_TOGGLED, opts => {
  return new Promise(res => res(opts))
})

export const resetCertificateToEdit = createAction(SECURITY_SSL_CERTIFICATE_TO_EDIT_RESET)
