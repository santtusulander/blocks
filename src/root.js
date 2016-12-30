import React, { PropTypes } from 'react'

import { Provider } from 'react-redux'
import { Router, browserHistory, Route } from 'react-router'
import { IntlProvider } from 'react-intl'

import { LogPageView } from './util/google-analytics'
import { getRoutes } from './routes'
import Login from './containers/login'
import TRANSLATED_MESSAGES from './locales/en/'

const Root = ({ store }) =>
  <IntlProvider locale="en" messages={TRANSLATED_MESSAGES}>
    <Provider store={store}>
      <Router onUpdate={LogPageView} history={browserHistory}>
        {getRoutes(store)}
        <Route path="/login" component={Login}/>
      </Router>
    </Provider>
  </IntlProvider>

Root.displayName = "Root"
Root.propTypes = {
  store: PropTypes.object.isRequired
}
export default Root
