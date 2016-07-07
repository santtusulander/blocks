import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import forEach from 'lodash/foreach';

import AccountManagement from './containers/account-management'
import Accounts from './containers/accounts'
import Configuration from './containers/configuration'
import Configurations from './containers/configurations'
import Groups from './containers/groups'
import Hosts from './containers/hosts'
import Login from './containers/login'
import Main from './containers/main'
import Property from './containers/property'
import Purge from './containers/configure/purge'
import Security from './containers/security'
import Services from './containers/services'
import StarburstHelp from './containers/starburst-help'
import Styleguide from './containers/styleguide'

import ContentTransition from './transitions/content'

/* TODO: define routes here instead of 'fixed' paths */
const routes = {
  analytics: '/analysis',
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
  contentBrand: ':brand',
  contentAccount: ':brand/:account',
  contentGroup: ':brand/:account/:group',
  contentProperty: ':brand/:account/:group/:property',
  contentPropertyAnalytics: ':brand/:account/:group/:property/analytics',
  contentPropertyConfiguration: ':brand/:account/:group/:property/configuration',

  accountManagement: '/account-management',
  accountManagementBrand: '/account-management/:brand',
  accountManagementAccount: '/account-management/:brand/:account',
  services: '/services',
  security: '/security',
  support: '/services',
  configuration: '/services'
}

/**
 *
 * @param {string} name
 * @param {Object} params
 * @returns {string}
 */
export function getRoute(name, params) {
  if (!routes[name]) {
    throw new Error('Unknown route "%s"', name)
  }

  let route = routes[name]

  if (params) {
    forEach(params, (value, key) => {
      route = route.replace(`:${key}`, value)
    })
  }

  return route
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
      <Route path={routes.analyticsTabTraffic} component={AnalyticsTabTraffic} />
      <Route path={routes.analyticsTabVisitors} component={AnalyticsTabVisitors} />
      <Route path={routes.analyticsTabOnOffNet} component={AnalyticsTabOnOffNet} />
      <Route path={routes.analyticsTabServiceProviders} component={AnalyticsTabServiceProviders} />
      <Route path={routes.analyticsTabFileError} component={AnalyticsTabFileError} />
      <Route path={routes.analyticsTabUrlReport} component={AnalyticsTabUrlReport} />
      <Route path={routes.analyticsTabPlaybackDemo} component={AnalyticsTabPlaybackDemo} />
    </Route>
  )
}

module.exports = (
  <Route path="/" component={Main}>
    <IndexRedirect to={getRoute('contentBrand', { brand: 'udn' })} />
    <Route path="starburst-help" component={StarburstHelp}/>
    <Route path="styleguide" component={Styleguide}/>
    <Route path="configure/purge" component={Purge}/>
    <Route path="/login" component={Login}/>

    {/* Analytics - routes */}
    <Route path={routes.analytics}>
      {/* default - set 'udn' as brand */}
      <IndexRedirect to="udn" />
      <Route path={routes.analyticsBrand} component={AnalyticsContainer} />
      <Route path={routes.analyticsAccount} component={AnalyticsContainer}>
          {getAnalyticsTabRoutes()}
      </Route>
      <Route path={routes.analyticsGroup} component={AnalyticsContainer}>
          {getAnalyticsTabRoutes()}
      </Route>
      <Route path={routes.analyticsProperty} component={AnalyticsContainer}>
          {getAnalyticsTabRoutes()}
      </Route>
    </Route>

    {/* Content - routes */}
    <Route path={routes.content}>
      <IndexRedirect to={getRoute('contentBrand', { brand: 'udn' })} />
      <Route component={ContentTransition}>
        <Route path={routes.contentBrand} component={Accounts}/>
        <Route path={routes.contentAccount} component={Groups}/>
        <Route path={routes.contentGroup} component={Hosts}/>
      </Route>
      <Route path={routes.contentProperty} component={Property} />
      <Route path={routes.contentPropertyAnalytics} component={AnalyticsContainer} >
        {getAnalyticsTabRoutes()}
        </Route>
      <Route path={routes.contentPropertyConfiguration} component={Configuration} />
    </Route>

    <Route path="/configurations">
      <Route path=":brand" component={Configurations}/>
    </Route>

    <Route path="/security">
      <IndexRedirect to="ssl-certificate"/>
      <Route path=":subPage">
        <Route path=":account/:group" component={Security}/>
        <Route path=":account" component={Security}/>
      </Route>
    </Route>
    <Route path="/services" component={Services}/>

    {/* Analytics - routes */}
    <Route path={routes.accountManagement}>
      <IndexRedirect to={getRoute('accountManagementBrand', { brand: 'udn' })} />
      <Route path={routes.accountManagementBrand} component={AccountManagement}/>
      <Route path={routes.accountManagementAccount} component={AccountManagement}/>
    </Route>
  </Route>
);
