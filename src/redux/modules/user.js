import {createAction} from 'redux-actions'
import axios from 'axios'
import {handleActions} from 'redux-actions'
import Immutable from 'immutable'

import {urlBase} from '../util'

const USER_LOGGED_IN = 'USER_LOGGED_IN'
const USER_LOGGED_OUT = 'USER_LOGGED_OUT'
const USER_START_FETCH = 'USER_START_FETCH'

// Create an axios instance that doesn't use defaults to test credentials
const loginAxios = axios.create()

// TODO: This is all fake and insecure until Keystone sign on is ready

const emptyUser = Immutable.Map({
  fetching: false,
  loggedIn: false
})

// REDUCERS

export default handleActions({
  USER_LOGGED_IN: {
    next(state, action) {
      // TODO: Real auth will return a token or set a cookie
      const token = btoa(`${action.payload.username}:${action.payload.password}`)
      axios.defaults.headers.common['Authorization'] = 'Basic ' + token
      return state.merge({loggedIn: true, fetching: false})
    },
    throw() {
      return emptyUser
    }
  },
  USER_LOGGED_OUT: (state) => {
    axios.defaults.headers.common['Authorization'] = 'Basic 000'
    return state.set('loggedIn', false)
  },
  USER_START_FETCH: (state) => {
    return state.set('fetching', true)
  }
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
