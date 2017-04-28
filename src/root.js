import React, { PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'

import { LogPageView } from './util/google-analytics'
import AppRoutes from './routes'
//import Login from './containers/login'
import ConnectedIntlProvider from './decorators/connected-intl-provider'


const Root = ({ store }) => {
  return (
    <Provider store={store}>
      <ConnectedIntlProvider>
        <Router onUpdate={LogPageView} history={browserHistory}>
          { AppRoutes }
          {/* <Route path="/login" component={Login}/> */}
        </Router>
      </ConnectedIntlProvider>
    </Provider>
  )
}


Root.displayName = "Root"
Root.propTypes = {
  store: PropTypes.object.isRequired
}
export default Root
