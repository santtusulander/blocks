import {createAction, handleActions} from 'redux-actions'
import axios from 'axios'
import Immutable from 'immutable'

import {urlBase, mapReducers} from '../util'

const USER_LOGGED_IN = 'USER_LOGGED_IN'
const USER_LOGGED_OUT = 'USER_LOGGED_OUT'
const USER_START_FETCH = 'USER_START_FETCH'
const USER_TOKEN_CHECKED = 'USER_TOKEN_CHECKED'
const USER_FETCHED_ALL = 'USER_FETCHED_ALL'

// Create an axios instance that doesn't use defaults to test credentials
const loginAxios = axios.create()

// TODO: This is all fake and insecure until Keystone sign on is ready

const emptyUser = Immutable.Map({
  allUsers: Immutable.List(),
  fetching: false,
  loggedIn: false
})

// REDUCERS
export function userLoggedInSuccess(state, action){
  localStorage.setItem('EricssonUDNUserToken', action.payload.token)
  localStorage.setItem('EricssonUDNUserName', action.payload.username)

  axios.defaults.headers.common['X-Auth-Token'] = action.payload.token

  return state.merge({
    loggedIn: true,
    fetching: false,
    username: action.payload.username
  })
}

export function userLoggedInFailure(){
  return emptyUser
}

export function fetchAllSuccess(state, action) {
  return state.merge({
    allUsers: Immutable.fromJS(action.payload),
    fetching: false
  })
}

export function fetchAllFailure(state) {
  return state.merge({
    allUsers: Immutable.List(),
    fetching: false
  })
}

export function userLoggedOutSuccess(state){
  localStorage.removeItem('EricssonUDNUserToken')
  localStorage.removeItem('EricssonUDNUserName')
  delete axios.defaults.headers.common['X-Auth-Token']

  return state.set('loggedIn', false)
}

export function userStartFetch(state){
  return state.set('fetching', true)
}

export function userTokenChecked(state, action){
  if(action.payload && action.payload.token) {
    localStorage.setItem('EricssonUDNUserToken', action.payload.token)
    axios.defaults.headers.common['X-Auth-Token'] = action.payload.token

    return state.merge({
      loggedIn: true,
      username: action.payload.username
    })
  }
  else {
    localStorage.removeItem('EricssonUDNUserToken')
    localStorage.removeItem('EricssonUDNUserName')
    delete axios.defaults.headers.common['X-Auth-Token']

    return state.set('loggedIn', false)
  }
}

export default handleActions({
  USER_LOGGED_IN: mapReducers( userLoggedInSuccess, userLoggedInFailure ),
  USER_LOGGED_OUT: userLoggedOutSuccess,
  USER_START_FETCH: userStartFetch,
  USER_TOKEN_CHECKED: userTokenChecked,
  USER_FETCHED_ALL: mapReducers(fetchAllSuccess, fetchAllFailure),
}, emptyUser)

// ACTIONS

export const logIn = createAction(USER_LOGGED_IN, (username, password) => {
  // TODO: This is not the right url but works now to check credentials
  return loginAxios.post(`${urlBase}/v2/tokens`,
    {
      "username": username,// superuser
      "brand_id": "udn",
      "password": password,// Video4All!
      "account_id": 1
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  .then((res) => {
    if(res) {
      return {username: username, token: res.data}
    }
  }, (res) => {
    throw new Error(res.data.message)
  });
})

export const logOut = createAction(USER_LOGGED_OUT)

export const startFetching = createAction(USER_START_FETCH)

export const checkToken = createAction(USER_TOKEN_CHECKED, () => {
  return {
    token: localStorage.getItem('EricssonUDNUserToken') || null,
    username: localStorage.getItem('EricssonUDNUserName')
  }
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

  return axios.get(`${urlBase}/v2/users${query}`)
    .then((res) => {
      if(res) {
        return res.data;
      }
    });
})
//
// export const fetchToken = createAction(USER_TOKEN_FETCHED, () => {
//   return axios.post(`${urlBase}/v2/tokens`, {
//     "username": "superuser",
//     "brand_id": "udn",
//     "password": "Video4All!",
//     "account_id": 1}
//   })
//   .then((res) => {
//     if(res.data) {
//       return res.data
//     }
//   })
// })
