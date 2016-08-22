import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import promiseMiddleware from 'redux-promise'
import thunkMiddleware from 'redux-thunk'
import axios from 'axios'
import { Button } from 'react-bootstrap'

import { getRoutes } from './routes'
import * as reducers from './redux/modules'
import { showInfoDialog, hideInfoDialog } from './redux/modules/ui'
import { LogPageView } from './util/google-analytics'

import './styles/style.scss'

const shouldCallApiMiddleware = ({ getState }) => next => action => {
  const { payload } = action
  if (!payload || !payload.shouldCallApi) {
    return next(action)
  }
  const { shouldCallApi, toFetch, typeToFetch, callApi } = payload
  if (typeof shouldCallApi !== 'function') {
    throw new Error('shouldCallApi must be a function.')
  }

  if (!shouldCallApi(getState(), typeToFetch, toFetch)) {
    return
  }
  callApi().then(res => {
    return next(Promise.resolve({ type: action.type, payload: res }))
  })
}

const createStoreWithMiddleware = applyMiddleware(
  //shouldCallApiMiddleware,
  thunkMiddleware,
  promiseMiddleware
)(createStore)
const stateReducer = combineReducers(reducers)
const store = createStoreWithMiddleware(stateReducer)

// Set up axios defaultHeaders
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.timeout = 30000

// Handle 401s with a redirect to login page
// Handle 403s with a InfoDialod & display message
// display ErrorModal on other errors
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error) {
    const status = error.status;
    if (status === 401) {
      if(!location.href.includes('/login')
        && !location.href.includes('/set-password')
        && !location.href.includes('/forgot-password')) {
        location.href='/login'
      }
    }
    else if (status === 403) {
      store.dispatch(showInfoDialog({
        title: 'Unauthorized',
        content: 'You do not have permission to access information on this page.',
        buttons: <Button onClick={() => store.dispatch(hideInfoDialog())} bsStyle="primary">OK</Button>
      }));
    }
    else if (status === 500 || status === 404) {
      store.dispatch({ type: 'UI_SHOW_ERROR_DIALOG' })
    }
  }

  return Promise.reject(error);
});

ReactDOM.render(
  <Provider store={store}>
    <Router onUpdate={LogPageView} history={browserHistory}>
      {getRoutes(store)}
    </Router>
  </Provider>, document.getElementById('content')
);
