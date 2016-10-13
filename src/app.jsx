import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import promiseMiddleware from 'redux-promise'
import axios from 'axios'
import { Button } from 'react-bootstrap'

import { getRoutes } from './routes'
import * as reducers from './redux/modules'
import { showInfoDialog, hideInfoDialog, setLoginUrl } from './redux/modules/ui'
import { LogPageView } from './util/google-analytics'

import { IntlProvider, FormattedMessage } from 'react-intl';

import './styles/style.scss'

import TRANSLATED_MESSAGES from './locales/en/'

const createStoreWithMiddleware = applyMiddleware(
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
            buttons: (
              <a href="/login">
                <Button bsStyle="primary">
                  <FormattedMessage id='portal.common.error.tokenExpire.button'/>
                </Button>
              </a>
            )
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
        buttons: (
          <Button onClick={() => store.dispatch(hideInfoDialog())} bsStyle="primary">
            <FormattedMessage id='portal.common.button.ok'/>
          </Button>
        )
      }));
    }
    else if (status === 500 || status === 404) {
      store.dispatch({ type: 'UI_SHOW_ERROR_DIALOG' })
    }
  }

  return Promise.reject(error);
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

// Check if Intl -polyfill required
if (!window.Intl) {
  require.ensure([
    'intl',
    'intl/locale-data/jsonp/en.js'
  ], (require) => {
    require('intl');
    require('intl/locale-data/jsonp/en.js');

    runApp();
  });
} else {
  runApp();
}
