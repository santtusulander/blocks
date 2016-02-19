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
axios.defaults.headers.common['Authorization'] = 'Basic ' + btoa('test:test') // TODO: awaiting login docs
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.post['Content-Type'] = 'application/json'

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
