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

require('./styles/style.scss')

window.React = React

// Set up axios defaultHeaders
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.post['Content-Type'] = 'application/json'
// Handle 401s with a redirect to login page
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if(error && error.status === 401) {
    location.href='/login'
  }
  return Promise.reject(error);
});

const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware
)(createStore)
const stateReducer = combineReducers(reducers)
const store = createStoreWithMiddleware(stateReducer)

ReactDOM.render(
  <Provider store={store}>
    <Router history={createBrowserHistory()}>
      {routes}
    </Router>
  </Provider>, document.getElementById('content')
);
