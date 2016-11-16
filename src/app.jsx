import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import promiseMiddleware from 'redux-promise'
import axios from 'axios'
import Raven from 'raven-js'
import UdnRavenMiddleware, {captureAndShowRavenError} from './redux/middleware/raven';
import { IntlProvider, FormattedMessage } from 'react-intl';

import { getRoutes } from './routes'
import * as reducers from './redux/modules'
import { showInfoDialog, hideInfoDialog, setLoginUrl } from './redux/modules/ui'
import { LogPageView } from './util/google-analytics'
import {SENTRY_DSN} from './constants/sentry'
import './styles/style.scss'

import TRANSLATED_MESSAGES from './locales/en/'

const useRaven = true //process.env.NODE_ENV === 'production'

/* Initialize Middlewares */
const createStoreWithMiddleware =
  useRaven
  ?  applyMiddleware(
      /* eslint-disable no-undef */
      UdnRavenMiddleware(SENTRY_DSN, {release: VERSION}),
      /* eslint-enable no-undef */

      promiseMiddleware
    )(createStore)
  : applyMiddleware(
      promiseMiddleware
    )(createStore)

const stateReducer = combineReducers(reducers)
const store =
  process.env.NODE_ENV === 'development' ?
    // enable redux-devtools-extension in development environment
    createStoreWithMiddleware(stateReducer, window.devToolsExtension && window.devToolsExtension()) :
    createStoreWithMiddleware(stateReducer)

// Enable Webpack hot module replacement for reducers
if (module.hot) {
  module.hot.accept('./redux/modules', () => {
    const nextRootReducer = require('./redux/modules');
    store.replaceReducer(combineReducers(nextRootReducer));
  });
}

// Set up axios defaultHeaders
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.timeout = 300000

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

        const loggedIn = store.getState().user.get('loggedIn') === true
        const method = error.config.method.toLowerCase()
        const tokenDidExpire = loggedIn && method === 'get'

        store.dispatch(setLoginUrl(`${location.pathname}${location.search}`))

        if (tokenDidExpire) {
          store.dispatch(showInfoDialog({
            title: <FormattedMessage id='portal.common.error.tokenExpire.title'/>,
            content: <FormattedMessage id='portal.common.error.tokenExpire.content'/>,
            loginButton: true
          }));
        } else {
          browserHistory.push('/login')
        }
      }
    }
    else if (status === 403) {
      store.dispatch(showInfoDialog({
        title: <FormattedMessage id='portal.common.error.unauthorized.title'/>,
        content: <FormattedMessage id='portal.common.error.unauthorized.content'/>,
        okButton: true,
        cancel: () => store.dispatch(hideInfoDialog())
      }));
    }
    else if (status === 500 || status === 404) {
      if (Raven.isSetup()) {
        captureAndShowRavenError(store, error.data.message, null, true)
      } else {
        store.dispatch({ type: 'UI_SHOW_ERROR_DIALOG' })
      }
    }
  }

  return Promise.reject(error)
});

const runApp = () => {
  ReactDOM.render(
    <IntlProvider locale="en" messages={TRANSLATED_MESSAGES}>
      <Provider store={store}>
        <Router onUpdate={LogPageView} history={browserHistory}>
        {getRoutes(store)}
        </Router>
      </Provider>
    </IntlProvider>, document.getElementById('content')
  );
}

let startApp = runApp

if (useRaven) {
  /* eslint-disable no-undef */
  if (!Raven.isSetup()) Raven.config(SENTRY_DSN, {release: VERSION}).install()
  /* eslint-enable no-undef */

  startApp = Raven.wrap( runApp )

  let errorDisplayed = false

  window.addEventListener('unhandledrejection', (data) => {
    if (!errorDisplayed) {
      /* eslint-disable no-console */
      console.error('Unrecoverable onunhandledrejection happened.')
      captureAndShowRavenError(store, data.reason, null, false)
      errorDisplayed = true
    }
  })

  window.addEventListener('error', (data) => {
    if (!errorDisplayed) {
      /* eslint-disable no-console */
      console.error('Unrecoverable error happened.')
      captureAndShowRavenError(store, data.reson, null, false)
      errorDisplayed = true;
    }
  })
}

// Check if Intl -polyfill required
if (!window.Intl) {
  require.ensure([
    'intl',
    'intl/locale-data/jsonp/en.js'
  ], (require) => {
    require('intl');
    require('intl/locale-data/jsonp/en.js');

    startApp();
  });
} else {
  startApp();
}
