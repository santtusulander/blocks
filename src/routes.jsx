import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import AccountManagement from './containers/account-management/account-management'
import AccountManagementAccount from './components/account-management/account/account'
import AccountManagementUsers from './containers/account-management/tabs/users'
import AccountManagementGroups from './components/account-management/account/groups'
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
import Support from './containers/support'
import StarburstHelp from './containers/starburst-help'
import Styleguide from './containers/styleguide'

import ContentTransition from './transitions/content'

/* TODO: define routes here instead of 'fixed' paths */
const routes = {
  analytics: '/analysis',
  analyticsBrand: '/analysis/:brand',
  analyticsAccount: '/analysis/:brand/:account',
  analyticsGroup: '/analysis/:brand/:account/:group',
  analyticsProperty: '/analysis/:brand/:account/:group/:property',

  analyticsTabTraffic: 'traffic',
  analyticsTabVisitors: 'visitors',
  analyticsTabOnOffNet: 'on-off-net',
  analyticsTabServiceProviders: 'service-providers',
  analyticsTabFileError: 'file-error',
  analyticsTabUrlReport: 'url-report',
  analyticsTabPlaybackDemo: 'playback-demo',

  content: '/content',
  contentBrand: '/content/:brand',
  contentAccount: '/content/:brand/:account',
  contentGroup: '/content/:brand/:account/:group',
  contentProperty: '/content/:brand/:account/:group/:property',
  contentPropertyAnalytics: '/content/:brand/:account/:group/:property/analytics',
  contentPropertyConfiguration: '/content/:brand/:account/:group/:property/configuration',

  accountManagement: '/account-management',
  accountManagementBrand: '/account-management/:brand',
  accountManagementAccount: '/account-management/:brand/:account',
  accountManagementGroup: '/account-management/:brand/:account/:group',
  accountManagementProperty: '/account-management/:brand/:account/:group/:property',

  accountManagementTabDetails: 'details',
  accountManagementTabGroups: 'groups',
  accountManagementTabUsers: 'users',

  services: '/services',
  servicesBrand: '/services/:brand',
  servicesAccount: '/services/:brand/:account',
  servicesGroup: '/services/:brand/:account/:group',
  servicesProperty: '/services/:brand/:account/:group/:property',

  security: '/security',
  securityBrand: '/security/:brand',
  securityAccount: '/security/:brand/:account',
  securityGroup: '/security/:brand/:account/:group',
  securityProperty: '/security/:brand/:account/:group/:property',

  securityTabSslCertificate: 'ssl-certificate',
  securityTabContentTargeting: 'content-targeting',
  securityTabTokenAuthentication: 'token-authentication',

  support: '/support',
  supportBrand: '/support/:brand',
  supportAccount: '/support/:brand/:account',
  supportGroup: '/support/:brand/:account/:group',
  supportProperty: '/support/:brand/:account/:group/:property',

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
    Object.keys(params).forEach(key => {
      route = route.replace(`:${key}`, params[key])
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
    <IndexRedirect to={getRoute('content', { brand: 'udn' })} />
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

    {/* Security - routes */}
    <Route path={routes.security}>
      <IndexRedirect to={getRoute('securityBrand', { brand: 'udn' })} />
      <Route path={routes.securityBrand} component={Security} />
      <Route path={routes.securityAccount} component={Security}>
        <IndexRedirect to={routes.securityTabSslCertificate} />
        <Route path={routes.securityTabSslCertificate} component={Security}/>
        <Route path={routes.securityTabContentTargeting} component={Security}/>
         <Route path={routes.securityTabTokenAuthentication} component={Security}/>
      </Route>
      <Route path={routes.securityGroup} component={Security}>
        <IndexRedirect to={routes.securityTabSslCertificate} />
        <Route path={routes.securityTabSslCertificate} component={Security}/>
        <Route path={routes.securityTabContentTargeting} component={Security}/>
        <Route path={routes.securityTabTokenAuthentication} component={Security}/>
      </Route>
      <Route path={routes.securityProperty} component={Security}>
        <IndexRedirect to={routes.securityTabSslCertificate} />
        <Route path={routes.securityTabSslCertificate} component={Security}/>
        <Route path={routes.securityTabContentTargeting} component={Security}/>
        <Route path={routes.securityTabTokenAuthentication} component={Security}/>
      </Route>
    </Route>

    {/* Services - routes */}
    <Route path={routes.services}>
      <IndexRedirect to={getRoute('servicesBrand', { brand: 'udn' })} />
      <Route path={routes.servicesBrand} component={Services}/>
      <Route path={routes.servicesAccount} component={Services}/>
      <Route path={routes.servicesGroup} component={Services}/>
      <Route path={routes.servicesProperty} component={Services}/>
    </Route>

    {/* Support - routes */}
    <Route path={routes.support}>
      <IndexRedirect to={getRoute('supportBrand', { brand: 'udn' })} />
      <Route path={routes.supportBrand} component={Support}/>
      <Route path={routes.supportAccount} component={Support}/>
      <Route path={routes.supportGroup} component={Support}/>
      <Route path={routes.supportProperty} component={Support}/>
    </Route>

    {/* Account management - routes */}
    <Route path={routes.accountManagement}>
      <IndexRedirect to={getRoute('accountManagementBrand', { brand: 'udn' })} />
      <Route path={routes.accountManagementBrand} component={AccountManagement}/>
      <Route path={routes.accountManagementAccount} component={AccountManagement}>
        <IndexRedirect to={routes.accountManagementTabDetails}/>
        <Route path={routes.accountManagementTabDetails} component={AccountManagementAccount}/>
        <Route path={routes.accountManagementTabGroups} component={AccountManagementGroups}/>
        <Route path={routes.accountManagementTabUsers} component={AccountManagementUsers}/>
      </Route>
      <Route path={routes.accountManagementGroup} component={AccountManagement}>
        <IndexRedirect to={routes.accountManagementTabDetails}/>
        <Route path={routes.accountManagementTabDetails} component={AccountManagementAccount}/>
        <Route path={routes.accountManagementTabGroups} component={AccountManagementGroups}/>
        <Route path={routes.accountManagementTabUsers} component={AccountManagementUsers}/>
      </Route>
      <Route path={routes.accountManagementProperty} component={AccountManagement}>
        <IndexRedirect to={routes.accountManagementTabDetails}/>
        <Route path={routes.accountManagementTabDetails} component={AccountManagementAccount}/>
        <Route path={routes.accountManagementTabGroups} component={AccountManagementGroups}/>
        <Route path={routes.accountManagementTabUsers} component={AccountManagementUsers}/>
      </Route>
    </Route>
  </Route>
);
