import axios from 'axios'
import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

import { mapReducers, BASE_URL_NORTH } from '../util'

const SECURITY_SSL_CERTIFICATES_FETCH = 'SECURITY_SSL_CERTIFICATES_FETCH'
const SECURITY_SSL_CERTIFICATE_FETCH = 'SECURITY_SSL_CERTIFICATE_FETCH'
const SECURITY_ACTIVE_CERTIFICATES_TOGGLED = 'SECURITY_ACTIVE_CERTIFICATES_TOGGLED'
const SECURITY_SSL_CERTIFICATES_UPLOAD = 'SECURITY_SSL_CERTIFICATES_UPLOAD'
const SECURITY_SSL_CERTIFICATES_DELETE = 'SECURITY_SSL_CERTIFICATES_DELETE'
const SECURITY_SSL_CERTIFICATES_EDIT = 'SECURITY_SSL_CERTIFICATES_EDIT'
const SECURITY_SSL_CERTIFICATE_TO_EDIT_RESET = 'SECURITY_SSL_CERTIFICATE_TO_EDIT_RESET'

export const initialState = fromJS({
  fetching: false,
  certificateToEdit: {},
  activeCertificates: [],
  sslCertificates: []
})

// REDUCERS

export function fetchSSLCertificatesSuccess(state, action) {
  return state.set('sslCertificates', fromJS(action.payload))
}

export function fetchSSLCertificatesFailure(state) {
  return state.merge({
    fetching: false
  })
}

export function uploadSSLCertificateSuccess(state, action) {
  const { account, certificate } = action.payload
  const sslCertificates = state.get('sslCertificates')
  return state.merge({ sslCertificates: sslCertificates
    .merge(sslCertificates.push(fromJS(certificate).merge({ account })))
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
  const { account, certificate } = action.payload
  return state.merge({ certificateToEdit: fromJS(certificate).merge({ account }) })
}

export function editSSLCertificateSuccess(state, action) {
  const { account, certificate } = action.payload
  const sslCertificates = state.get('sslCertificates')
  const itemIndex = sslCertificates.findIndex(item => item.get('cn') === state.get('certificateToEdit').get('cn'))
  return state.merge({ sslCertificates: sslCertificates.update(itemIndex,
    item => item.merge(fromJS(certificate).merge({ account }))
  )})

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
export const uploadSSLCertificate = createAction(SECURITY_SSL_CERTIFICATES_UPLOAD, (brand, account, data) => {
  return axios.post(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/certs`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response && { account, certificate: response.data })
})

export const deleteSSLCertificate = createAction(SECURITY_SSL_CERTIFICATES_DELETE, (brand, account, cert) => {
  return axios.delete(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/certs/${cert}`)
})

export const editSSLCertificate = createAction(SECURITY_SSL_CERTIFICATES_EDIT, (brand, account, data, cert) => {
  return axios.put(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/certs/${cert}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response && { account, certificate: response.data })
})

export const fetchSSLCertificate = createAction(SECURITY_SSL_CERTIFICATE_FETCH, (brand, account, commonName) => {
  return axios.get(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/certs/${commonName}`)
    .then(response => response && { account, certificate: response.data })
})


export const fetchSSLCertificates = createAction(SECURITY_SSL_CERTIFICATES_FETCH, (brand, account) => {
  if (!account) {
    return Promise.resolve([])
  }

  return axios.get(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/certs`)
    .then(action => Promise.all(action.data.map(
      cn => axios.get(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/certs/${cn}`)
    )))
    .then(resp => resp.map(certificate => {
      return {
        cn: certificate.data.cn,
        title: certificate.data.title,
        account
      }
    }))
})

export const toggleActiveCertificates = createAction(SECURITY_ACTIVE_CERTIFICATES_TOGGLED, opts => {
  return new Promise(res => res(opts))
})

export const resetCertificateToEdit = createAction(SECURITY_SSL_CERTIFICATE_TO_EDIT_RESET)
