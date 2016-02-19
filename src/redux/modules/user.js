import {createAction} from 'redux-actions'
import axios from 'axios'
import {handleActions} from 'redux-actions'
import Immutable from 'immutable'

import {urlBase} from '../util'

const USER_LOGGED_IN = 'USER_LOGGED_IN'
const USER_LOGGED_OUT = 'USER_LOGGED_OUT'
const USER_START_FETCH = 'USER_START_FETCH'

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
      return state.set('loggedIn', true)
    },
    throw() {
      return emptyUser
    }
  },
  USER_LOGGED_OUT: (state) => {
    axios.defaults.headers.common['Authorization'] = ''
    return state.set('loggedIn', false)
  },
  USER_START_FETCH: (state) => {
    return state.set('fetching', true)
  }
}, emptyUser)

// ACTIONS

export const logIn = createAction(USER_LOGGED_IN, (username, password) => {
  // TODO: This is not the right url but works now to check credentials
  return axios.get(`${urlBase}/VCDN/v2/udn/accounts`)
  .then((res) => {
    if(res) {
      return {username: username, password: password}
    }
  });
})

export const logOut = createAction(USER_LOGGED_OUT)

export const startFetching = createAction(USER_START_FETCH)
