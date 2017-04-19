import React, { PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router, browserHistory, Route } from 'react-router'

import { LogPageView } from './util/google-analytics'
import { getRoutes } from './routes'
import Login from './containers/login'
import ConnectedIntlProvider from './containers/connectedIntlProvider'


const Root = ({ store }) =>
  <Provider store={store}>
    <ConnectedIntlProvider>
      <Router onUpdate={LogPageView} history={browserHistory}>
        {getRoutes(store)}
        <Route path="/login" component={Login}/>
      </Router>
    </ConnectedIntlProvider>
  </Provider>


Root.displayName = "Root"
Root.propTypes = {
  store: PropTypes.object.isRequired
}
export default Root
