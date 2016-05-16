import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import Router from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import promiseMiddleware from 'redux-promise'
import axios from 'axios'

import routes from './routes'
import * as reducers from './redux/modules'

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
  if(error && error.status === 401) {
    location.href='/login'
  } else {
    store.dispatch({ type: 'UI_SHOW_ERROR_DIALOG' })
  }

  return Promise.reject(error);
});

ReactDOM.render(
  <Provider store={store}>
    <Router history={createBrowserHistory()}>
      {routes}
    </Router>
  </Provider>, document.getElementById('content')
);
