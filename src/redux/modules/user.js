import {createAction} from 'redux-actions'
import axios from 'axios'
import {handleActions} from 'redux-actions'
import Immutable from 'immutable'

import {urlBase, mapReducers} from '../util'

const USER_LOGGED_IN = 'USER_LOGGED_IN'
const USER_LOGGED_OUT = 'USER_LOGGED_OUT'
const USER_START_FETCH = 'USER_START_FETCH'
const USER_TOKEN_CHECKED = 'USER_TOKEN_CHECKED'

// Create an axios instance that doesn't use defaults to test credentials
const loginAxios = axios.create()

// TODO: This is all fake and insecure until Keystone sign on is ready

const emptyUser = Immutable.Map({
  fetching: false,
  loggedIn: false
})

// REDUCERS

export function userLoggedInSuccess(state, action){
  // TODO: Real auth will return a token or set a cookie
  const token = btoa(`${action.payload.username}:${action.payload.password}`)

  localStorage.setItem('EricssonUDNUserToken', token)
  localStorage.setItem('EricssonUDNUserName', action.payload.username)

  axios.defaults.headers.common['Authorization'] = 'Basic ' + token

  return state.merge({
    loggedIn: true,
    fetching: false,
    username: action.payload.username
  })

}

export function userLoggedInFailure(state){
  return emptyUser
}

export function userLoggedOutSuccess(state, action){
  localStorage.removeItem('EricssonUDNUserToken')
  localStorage.removeItem('EricssonUDNUserName')
  axios.defaults.headers.common['Authorization'] = 'Basic 000'

  return state.set('loggedIn', false)
}

export function userStartFetch(state, action){
  return state.set('fetching', true)
}

export function userTokenChecked(state, action){
  if(action.payload) {
    localStorage.setItem('EricssonUDNUserToken', action.payload.token)
    axios.defaults.headers.common['Authorization'] = 'Basic ' + action.payload.token

    return state.merge({
      loggedIn: true,
      username: action.payload.username
    })
  }
  else {
    localStorage.removeItem('EricssonUDNUserToken')
    localStorage.removeItem('EricssonUDNUserName')
    axios.defaults.headers.common['Authorization'] = 'Basic 000'

    return state.set('loggedIn', false)
  }
}

export default handleActions({
  USER_LOGGED_IN: mapReducers( userLoggedInSuccess, userLoggedInFailure ),
  USER_LOGGED_OUT: userLoggedOutSuccess,
  USER_START_FETCH: userStartFetch,
  USER_TOKEN_CHECKED: userTokenChecked
}, emptyUser)

// ACTIONS

export const logIn = createAction(USER_LOGGED_IN, (username, password) => {
  // TODO: This is not the right url but works now to check credentials
  return loginAxios.get(`${urlBase}/VCDN/v2/udn/accounts`, {
    headers: {
      'Authorization': 'Basic ' + btoa(`${username}:${password}`)
    }
  })
  .then((res) => {
    if(res) {
      return {username: username, password: password}
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
