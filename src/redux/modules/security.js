import axios from 'axios'
import { createAction, handleActions } from 'redux-actions'
import { fromJS } from 'immutable'

import { mapReducers, BASE_URL_AAA, BASE_URL_NORTH } from '../util'

const SECURITY_SSL_CERTIFICATES_FETCH = 'SECURITY_SSL_CERTIFICATES_FETCH'
const SECURITY_SSL_CERTIFICATE_FETCH = 'SECURITY_SSL_CERTIFICATE_FETCH'
const SECURITY_ACTIVE_CERTIFICATES_TOGGLED = 'SECURITY_ACTIVE_CERTIFICATES_TOGGLED'
const SECURITY_SSL_CERTIFICATES_UPLOAD = 'SECURITY_SSL_CERTIFICATES_UPLOAD'
const SECURITY_SSL_CERTIFICATES_DELETE = 'SECURITY_SSL_CERTIFICATES_DELETE'
const SECURITY_SSL_CERTIFICATES_EDIT = 'SECURITY_SSL_CERTIFICATES_EDIT'
const SECURITY_SSL_CERTIFICATE_TO_EDIT_RESET = 'SECURITY_SSL_CERTIFICATE_TO_EDIT_RESET'
const SECURITY_MODAL_GROUPS_FETCH = 'SECURITY_MODAL_GROUPS_FETCH'
const SECURITY_START_FETCHING = 'SECURITY_START_FETCHING'

export const initialState = fromJS({
  groups: [],
  fetching: false,
  certificateToEdit: {},
  activeCertificates: [],
  sslCertificates: []
})

// REDUCERS
export const setFetching = (state) => {
  return state.merge({
    fetching: true
  })
}

export function fetchGroupsSuccess(state, action) {
  return state.merge({
    groups: fromJS(action.payload.data),
    fetching: false
  })
}

export function fetchGroupsFailure(state) {
  return state.merge({
    groups: fromJS([]),
    fetching: false
  })
}

export function fetchSSLCertificatesSuccess(state, action) {
  //return state.set('sslCertificates', fromJS(action.payload))
  return state.merge({
    sslCertificates: fromJS(action.payload),
    fetching: false
  })
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
  const { account, group, certificate } = action.payload
  const sslCertificates = state.get('sslCertificates')
  const itemIndex = sslCertificates.findIndex(item => item.get('cn') === state.get('certificateToEdit').get('cn'))
  return state.merge({ sslCertificates: sslCertificates.update(itemIndex,
    item => item.merge(fromJS(certificate).merge({ account, group }))
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
  SECURITY_MODAL_GROUPS_FETCH: mapReducers(fetchGroupsSuccess, fetchGroupsFailure),
  SECURITY_SSL_CERTIFICATES_FETCH: mapReducers(fetchSSLCertificatesSuccess, fetchSSLCertificatesFailure),
  SECURITY_SSL_CERTIFICATE_FETCH: mapReducers(fetchSSLCertificateSuccess, fetchSSLCertificateFailure),
  SECURITY_ACTIVE_CERTIFICATES_TOGGLED: activeCertificatesToggled,
  SECURITY_SSL_CERTIFICATES_UPLOAD: mapReducers(uploadSSLCertificateSuccess, uploadSSLCertificateFailure),
  SECURITY_SSL_CERTIFICATES_DELETE: mapReducers(deleteSSLCertificateSuccess, deleteSSLCertificateFailure),
  SECURITY_SSL_CERTIFICATES_EDIT: mapReducers(editSSLCertificateSuccess, editSSLCertificateFailure),
  SECURITY_SSL_CERTIFICATE_TO_EDIT_RESET: certificateToEditReset,
  [SECURITY_START_FETCHING]: setFetching
}, initialState)

// ACTIONS
export const startFetching = createAction(SECURITY_START_FETCHING)

export const uploadSSLCertificate = createAction(SECURITY_SSL_CERTIFICATES_UPLOAD, (brand, account, group, data) => {
  return axios.post(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/certs`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response && { account, group, certificate: response.data })
})

export const deleteSSLCertificate = createAction(SECURITY_SSL_CERTIFICATES_DELETE, (brand, account, group, cert) => {
  return axios.delete(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/certs/${cert}`)
})

export const editSSLCertificate = createAction(SECURITY_SSL_CERTIFICATES_EDIT, (brand, account, group, data, cert) => {
  return axios.put(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/certs/${cert}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response && { account, group, certificate: response.data })
})

export const fetchSSLCertificate = createAction(SECURITY_SSL_CERTIFICATE_FETCH, (brand, account, group, commonName) => {
  return axios.get(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/certs/${commonName}`)
    .then(response => response && { account, group, certificate: response.data })
})


export const fetchSSLCertificates = createAction(SECURITY_SSL_CERTIFICATES_FETCH, (brand, account, group) => {
  if (!account || !group) {
    return Promise.resolve([])
  }

  return axios.get(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/certs`)
    .then(action => Promise.all(action.data.map(
      cn => axios.get(`${BASE_URL_NORTH}/brands/${brand}/accounts/${account}/groups/${group}/certs/${cn}`)
    )))
    .then(resp => resp.map(certificate => {
      return {
        group,
        cn: certificate.data.cn,
        title: certificate.data.title,
        date_not_valid_after: certificate.data.date_not_valid_after,
        account
      }
    }))
})

export const fetchGroupsForModal = createAction(SECURITY_MODAL_GROUPS_FETCH, (brand, account) => {
  return axios.get(`${BASE_URL_AAA}/brands/${brand}/accounts/${account}/groups`)
  .then((res) => {
    if(res) {
      return res.data;
    }
  });
})

export const toggleActiveCertificates = createAction(SECURITY_ACTIVE_CERTIFICATES_TOGGLED, opts => {
  return new Promise(res => res(opts))
})

export const resetCertificateToEdit = createAction(SECURITY_SSL_CERTIFICATE_TO_EDIT_RESET)
