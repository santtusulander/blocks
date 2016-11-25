import React from 'react'

import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import { Router, browserHistory, IndexRedirect, Route } from 'react-router'
import { IntlProvider } from 'react-intl'

import { LogPageView } from './util/google-analytics'
import { getRoutes } from './routes'
import Login from './containers/login'
import TRANSLATED_MESSAGES from './locales/en/'

export default class Root extends React.Component {
  render() {
    const store = this.props.store
    return (
      <IntlProvider locale="en" messages={TRANSLATED_MESSAGES}>
        <Provider store={store}>
          <Router onUpdate={LogPageView} history={browserHistory}>
            <IndexRedirect to='/login' />
            <Route path="/login" component={Login}/>
          </Router>
        </Provider>
      </IntlProvider>
    )
  }
}
