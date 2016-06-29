import React from 'react';
import { Route, IndexRedirect, Redirect } from 'react-router';

import AccountAnalytics from './containers/account-analytics'
import AccountManagement from './containers/account-management'
import Accounts from './containers/accounts'
import Configuration from './containers/configuration'
import Configurations from './containers/configurations'
import GroupAnalytics from './containers/group-analytics'
import Groups from './containers/groups'
import Hosts from './containers/hosts'
import Login from './containers/login'
import Main from './containers/main'
import Property from './containers/property'
import PropertyAnalytics from './containers/property-analytics'
import Purge from './containers/configure/purge'
import Security from './containers/security'
import Services from './containers/services'
import StarburstHelp from './containers/starburst-help'
import Styleguide from './containers/styleguide'

import ContentTransition from './transitions/content'

/* TODO: define routes here instead of 'fixed' paths */
const routes = {
  analytics: '/v2-analytics',
  analyticsBrand: ':brand',
  analyticsAccount: ':brand/:account',
  analyticsGroup: ':brand/:account/:group',
  analyticsProperty: ':brand/:account/:group/:property',

  analyticsTabTraffic: 'traffic',
  analyticsTabVisitors: 'visitors',
  analyticsTabOnOffNet: 'on-off-net',
  analyticsTabServiceProviders: 'service-providers',
  analyticsTabFileError: 'file-error',
  analyticsTabUrlReport: 'url-report',
  analyticsTabPlaybackDemo: 'playback-demo',

  content: '/content',

  accountManagement: '/account-management'
}

/* helper to get route by name */
export function getRoute(name) {
  return routes[name]
}

//Analytics v2
import AnalyticsContainer from './containers/analytics/analytics-container.jsx'

import AnalyticsTabTraffic from './containers/analytics/tabs/tab-traffic.jsx'
import AnalyticsTabVisitors from './containers/analytics/tabs/tab-visitors.jsx'
import AnalyticsTabOnOffNet from './containers/analytics/tabs/tab-on-off-net.jsx'
import AnalyticsTabServiceProviders from './containers/analytics/tabs/tab-service-providers.jsx'
import AnalyticsTabFileError from './containers/analytics/tabs/tab-file-error.jsx'
import AnalyticsTabUrlReport from './containers/analytics/tabs/tab-url-report.jsx'
import AnalyticsTabPlaybackDemo from './containers/analytics/tabs/tab-playback-demo.jsx'

/* helper for creating Tab-Routes */
function getAnalyticsTabRoutes() {
  return (
    <Route>
      <IndexRedirect to={routes.analyticsTabTraffic} />
      <Route path={routes.analyticsTabTraffic} component={ AnalyticsTabTraffic } />
      <Route path={routes.analyticsTabVisitors} component={ AnalyticsTabVisitors } />
      <Route path={routes.analyticsTabOnOffNet} component={ AnalyticsTabOnOffNet } />
      <Route path={routes.analyticsTabServiceProviders} component={ AnalyticsTabServiceProviders } />
      <Route path={routes.analyticsTabFileError} component={ AnalyticsTabFileError } />
      <Route path={routes.analyticsTabUrlReport} component={ AnalyticsTabUrlReport } />
      <Route path={routes.analyticsTabPlaybackDemo} component={ AnalyticsTabPlaybackDemo } />
    </Route>
  )
}

module.exports = (
  <Route path="/" component={Main}>
    <IndexRedirect to="/content/accounts/udn" />
    <Route path="starburst-help" component={StarburstHelp}/>
    <Route path="styleguide" component={Styleguide}/>
    <Route path="configure/purge" component={Purge}/>
    <Route path="/login" component={Login}/>

    { /* Analytics - routes */ }
    <Route path={routes.analytics}>
      { /* default - set 'udn' as brand */ }
      <IndexRedirect to="udn" />
      <Route path={routes.analyticsBrand} component={AnalyticsContainer} />
      <Route path={routes.analyticsAccount} component={AnalyticsContainer}>
          { getAnalyticsTabRoutes() }
      </Route>
      <Route path={routes.analyticsGroup} component={AnalyticsContainer}>
          { getAnalyticsTabRoutes() }
      </Route>
      <Route path={routes.analyticsProperty} component={AnalyticsContainer}>
          { getAnalyticsTabRoutes() }
      </Route>
    </Route>

    { /* Content - routes */ }
    <Route path={routes.content}>
      <Route component={ContentTransition}>
        <Route path="accounts">
          <Route path=":brand" component={Accounts}/>
        </Route>
        <Route path="groups">
          <Route path=":brand">
            <Route path=":account" component={Groups}/>
          </Route>
        </Route>
        <Route path="hosts">
          <Route path=":brand">
            <Route path=":account">
              <Route path=":group" component={Hosts}/>
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="property">
        <Route path=":brand">
          <Route path=":account">
            <Route path=":group">
              <Route path="property" component={Property}/>
            </Route>
          </Route>
        </Route>
      </Route>

      <Route path="configuration">
        <Route path=":brand">
          <Route path=":account">
            <Route path=":group">
              <Route path="property" component={Configuration}/>
            </Route>
          </Route>
        </Route>
      </Route>

      { /* TODO: This needs to be refactored to Content ... > property > analytics - routes & tabs */}
      <Route path="analytics">
        <Route path="account">
          <Route path=":brand">
            <Route path=":account" component={AccountAnalytics}/>
          </Route>
        </Route>
        <Route path="group">
          <Route path=":brand">
            <Route path=":account">
              <Route path=":group" component={GroupAnalytics}/>
            </Route>
          </Route>
        </Route>
        <Route path="property">
          <Route path=":brand">
            <Route path=":account">
              <Route path=":group">
                <Route path="property" component={PropertyAnalytics}/>
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Route>

    <Route path="/configurations">
      <Route path=":brand" component={Configurations}/>
    </Route>
    <Route path="/security">
      <IndexRedirect to="/security/ssl-certificate"/>
      <Route path=":subPage" component={Security}/>
    </Route>
    <Route path="/services" component={Services}/>

    {/* TODO: This is temporary until the user api is managing permissions */}
    <Route path="/account-management/:account" component={AccountManagement}/>
    <Route path="/account-management" component={AccountManagement}/>
  </Route>
);
