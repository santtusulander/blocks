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
  localStorage.setItem('EricssonUDNUserToken', action.payload.token)
  localStorage.setItem('EricssonUDNUserName', action.payload.username)
  console.log(action.payload.token)

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

export function userLoggedOutSuccess(state){
  localStorage.removeItem('EricssonUDNUserToken')
  localStorage.removeItem('EricssonUDNUserName')
  axios.defaults.headers.common['X-Auth-Token'] = ''

  return state.set('loggedIn', false)
}

export function userStartFetch(state){
  return state.set('fetching', true)
}

export function userTokenChecked(state, action){
  if(action.payload) {
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
    axios.defaults.headers.common['X-Auth-Token'] = ''

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
  return loginAxios.post(`${urlBase}/AAA/tokens`,
    {
      "username": username,// superuser
      "brand_id": "UDN",
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
//
// export const fetchToken = createAction(USER_TOKEN_FETCHED, () => {
//   return axios.post(`${urlBase}/AAA/tokens`, {
//     "username": "superuser",
//     "brand_id": "UDN",
//     "password": "Video4All!",
//     "account_id": 1}
//   })
//   .then((res) => {
//     if(res.data) {
//       return res.data
//     }
//   })
// })
