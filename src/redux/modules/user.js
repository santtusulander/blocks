import {createAction, handleActions} from 'redux-actions'
import axios from 'axios'
import { Map, List, fromJS } from 'immutable'

import {BASE_URL_AAA, mapReducers, parseResponseData} from '../util'
import {UDN_ADMIN_ROLE_ID} from '../../constants/roles'

const USER_LOGGED_IN = 'USER_LOGGED_IN'
const USER_LOGGED_OUT = 'USER_LOGGED_OUT'
const USER_START_FETCH = 'USER_START_FETCH'
const USER_FINISH_FETCH = 'USER_FINISH_FETCH'
const USER_TOKEN_CHECKED = 'USER_TOKEN_CHECKED'
const USER_FETCHED = 'USER_FETCHED'
const USER_FETCHED_ALL = 'USER_FETCHED_ALL'
const USER_DELETED = 'USER_DELETED'
const USER_CREATED = 'USER_CREATED'
const USER_UPDATED = 'USER_UPDATED'
const USER_NAME_SAVED = 'USER_NAME_SAVED'
const PASSWORD_UPDATED = 'PASSWORD_UPDATED'
const SET_LOGIN = 'user/SET_LOGIN'
const DESTROY_STORE = 'DESTROY_STORE'

// Create an axios instance that doesn't use defaults to test credentials
const loginAxios = axios.create()

//
//const username = localStorage.getItem('EricssonUDNUserName') || null
const emptyUser = Map({
  allUsers: List(),
  currentUser: Map(),
  fetching: false,
  loggedIn: false,
  username: null
})

// REDUCERS
export function updateSuccess(state, action) {
  const updatedUser = fromJS(action.payload)
  const currentUser = state.get('currentUser')
  const editingSelf = currentUser.get('email') === action.payload.email
  const currIndex = state.get('allUsers').findIndex(
    user => user.get('email') === updatedUser.get('email')
  )
  const updatedUsers = currIndex !== -1 ?
    state.get('allUsers').set(currIndex, updatedUser)
    : state.get('allUsers')

  return state.merge({
    allUsers: updatedUsers,
    currentUser: editingSelf ? updatedUser : currentUser,
    fetching: false
  })
}

export function updateFailure(state) {
  return state.merge({
    fetching: false
  })
}

export function updatePasswordSuccess(state) {
  return state.merge({
    fetching: false
  })
}

export function userLoggedInSuccess(state, action){
  localStorage.setItem('EricssonUDNUserToken', action.payload.token)
  axios.defaults.headers.common['X-Auth-Token'] = action.payload.token

  return state.merge({
    loggedIn: true
  })
}

export function userLoggedInFailure(){
  return emptyUser
}

export function fetchSuccess(state, action) {
  return state.merge({
    currentUser: fromJS(action.payload)
  })
}

export function fetchFailure(state) {
  return state.merge({
    currentUser: Map(),
    fetching: false
  })
}

export function fetchAllSuccess(state, action) {
  return state.merge({
    allUsers: fromJS(action.payload),
    fetching: false
  })
}

export function fetchAllFailure(state) {
  return state.merge({
    allUsers: List(),
    fetching: false
  })
}

export function userLoggedOutSuccess(state){
  localStorage.removeItem('EricssonUDNUserToken')
  delete axios.defaults.headers.common['X-Auth-Token']

  return state.merge({'loggedIn': false, 'fetching': false})
}

export function userStartFetch(state){
  return state.set('fetching', true)
}

export function userFinishFetch(state){
  return state.set('fetching', false)
}

export function deleteUserSuccess(state, action) {
  const newAllUsers = state.get('allUsers')
    .filterNot(user => {
      return user.get('email') === action.payload
    })
  return state.merge({
    allUsers: newAllUsers,
    fetching: false
  })
}

export function createUserSuccess(state, action) {
  return state.merge({
    allUsers: state.get('allUsers').push(fromJS(action.payload))
  })
}

export function createUserFailure(state) {
  return state
}

export function deleteUserFailure(state) {
  return state
}

export function userTokenChecked(state, action){
  if(action.payload && action.payload.token) {
    localStorage.setItem('EricssonUDNUserToken', action.payload.token)
    axios.defaults.headers.common['X-Auth-Token'] = action.payload.token

    return state.set('loggedIn', true)
  }
  else {
    localStorage.removeItem('EricssonUDNUserToken')
    delete axios.defaults.headers.common['X-Auth-Token']

    return state.set('loggedIn', false)
  }
}

export function userNameSave(state, action){
  if(action.payload) {
    localStorage.setItem('EricssonUDNUserName', action.payload)
  }
  else {
    localStorage.removeItem('EricssonUDNUserName')
  }
  return state.set('username', action.payload)
}

export const setLoggedIn = (state, action) => {
  return state.set('loggedIn', action.payload)
}

export default handleActions({
  USER_LOGGED_IN: mapReducers( userLoggedInSuccess, userLoggedInFailure ),
  USER_LOGGED_OUT: userLoggedOutSuccess,
  USER_START_FETCH: userStartFetch,
  USER_FINISH_FETCH: userFinishFetch,
  USER_TOKEN_CHECKED: userTokenChecked,
  USER_FETCHED: mapReducers(fetchSuccess, fetchFailure),
  USER_FETCHED_ALL: mapReducers(fetchAllSuccess, fetchAllFailure),
  USER_DELETED: mapReducers(deleteUserSuccess, deleteUserFailure),
  USER_CREATED: mapReducers(createUserSuccess, createUserFailure),
  USER_UPDATED: mapReducers(updateSuccess, updateFailure),
  USER_NAME_SAVED: userNameSave,
  PASSWORD_UPDATED: mapReducers(updatePasswordSuccess, updateFailure),
  [SET_LOGIN]: setLoggedIn
}, emptyUser)

// ACTIONS
export const destroyStore = createAction(DESTROY_STORE);

export const setLogin = createAction(SET_LOGIN, (value) => {
  return value
})

export const logIn = createAction(USER_LOGGED_IN, (username, password) => {
  // TODO: This is not the right url but works now to check credentials
  return loginAxios.post(`${BASE_URL_AAA}/tokens`,
    {
      "username": username,
      "password": password
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  .then((res) => {
    if(res) {
      return {token: res.data}
    }
  }, (res) => {
    throw new Error(res.data.message)
  });
})

export const logOut = createAction(USER_LOGGED_OUT, () => {
  const token = localStorage.getItem('EricssonUDNUserToken')

  if (token) {
    return loginAxios.delete(`${BASE_URL_AAA}/tokens/${token}`,
      {headers: {'X-Auth-Token': token}}
    )
  }
})

export const startFetching = createAction(USER_START_FETCH)

export const finishFetching = createAction(USER_FINISH_FETCH)

export const checkToken = createAction(USER_TOKEN_CHECKED, () => {
  const token = localStorage.getItem('EricssonUDNUserToken')
  if(token) {
    return loginAxios.get(`${BASE_URL_AAA}/tokens/${token}`,
      {headers: {'X-Auth-Token': token}}
    )
    .then(res => {
      if(res) {
        return {
          token: token,
          username: res.data.username
        }
      }
    })
  }

  return Promise.reject({data:{message:"No token"}})
})

export const fetchUser = createAction(USER_FETCHED, (username) => {
  return axios.get(`${BASE_URL_AAA}/users/${username}`)
    .then(parseResponseData)
})

export const fetchUsers = createAction(USER_FETCHED_ALL, (brandId = null, accountId = null, groupId = null) => {
  let query = ''
  if (groupId && accountId && brandId) {
    query = `?brand_id=${brandId}&account_id=${accountId}&group_id=${groupId}`
  } else if (accountId && brandId) {
    query = `?brand_id=${brandId}&account_id=${accountId}`
  } else if (brandId) {
    query = `?brand_id=${brandId}`
  }

  return axios.get(`${BASE_URL_AAA}/users${query}`)
    .then(parseResponseData)
})

export const fetchUsersForMultipleAccounts = createAction(USER_FETCHED_ALL, (brandId, accounts) => {
  return Promise.all(accounts.map(account => axios.get(`${BASE_URL_AAA}/users?brand_id=${brandId}&account_id=${account.get('id')}`)
    .then(parseResponseData)
  ))
  .then(allUsers => fromJS(allUsers).flatten(true))
})

export const deleteUser = createAction(USER_DELETED, user =>
  axios.delete(`${BASE_URL_AAA}/users/${user}`).then(() => user)
)

export const createUser = createAction(USER_CREATED, user =>
  axios.post(`${BASE_URL_AAA}/users`, user, { headers: { 'Content-Type': 'application/json' } })
    .then(parseResponseData)
    .catch(err => {
      throw new Error(err.data.message)
    })
)

export const updateUser = createAction(USER_UPDATED, (email, user) => {
  return axios.put(`${BASE_URL_AAA}/users/${email}`, user, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(parseResponseData)
})

export const updatePassword = createAction(PASSWORD_UPDATED, (email, password) => {
  return axios.post(`${BASE_URL_AAA}/users/${email}/password`, password, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(parseResponseData)
})

export const saveName = createAction(USER_NAME_SAVED)

/**
 * Selector for getting roles from currentUser
 * @param  {[type]} state [description]
 * @return {[type]}       [description]
 */
export const getUserRoles = ( state ) => {
  return state.getIn(['roles'])
}

/**
 * Check if user has role for UDN Admin
 * @param  {state}  currentUser state
 * @return {Boolean}
 */
export const isUdnAdmin = ( state ) => {
  if (state && state.get('roles') && state.get('roles').contains(UDN_ADMIN_ROLE_ID)) return true

  return false
}
