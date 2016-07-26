import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import promiseMiddleware from 'redux-promise'
import axios from 'axios'

import routes from './routes'
import * as reducers from './redux/modules'
import { LogPageView } from './util/google-analytics'

import './styles/style.scss'

const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware
)(createStore)
const stateReducer = combineReducers(reducers)
const store = createStoreWithMiddleware(stateReducer)

// Set up axios defaultHeaders
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.timeout = 30000

// Handle 401s with a redirect to login page
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
    } else if (status === 500 || status === 404) {
      store.dispatch({ type: 'UI_SHOW_ERROR_DIALOG' })
    }
  }
  
  return Promise.reject(error);
});

ReactDOM.render(
  <Provider store={store}>
    <Router onUpdate={LogPageView} history={browserHistory}>
      {routes}
    </Router>
  </Provider>, document.getElementById('content')
);
