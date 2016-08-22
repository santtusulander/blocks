import React from 'react'
import { Route, IndexRedirect, IndexRoute } from 'react-router'

import * as PERMISSIONS from './constants/permissions'
import {
  UserHasPermission,
  UserCanListAccounts,
  UserCanManageAccounts,
  UserCanTicketAccounts,
  UserCanViewAnalyticsTab,
  UserCanViewDns
} from './util/route-permissions-wrappers'

import AccountManagement from './containers/account-management/account-management'
import AccountManagementAccount from './components/account-management/account/account'
import AccountManagementAccountUsers from './containers/account-management/tabs/users'
import AccountManagementGroups from './containers/account-management/tabs/groups'
import AccountManagementAccounts from './components/account-management/system/accounts'
import AccountManagementSystemUsers from './components/account-management/system/users'
import AccountManagementBrands from './components/account-management/system/brands'
import AccountManagementDNS from './components/account-management/system/dns'
import AccountManagementRoles from './components/account-management/system/roles'
import AccountManagementServices from './components/account-management/system/services'
import AnalyticsContainer from './containers/analytics/analytics-container.jsx'
import AnalyticsTabTraffic from './containers/analytics/tabs/tab-traffic.jsx'
import AnalyticsTabVisitors from './containers/analytics/tabs/tab-visitors.jsx'
import AnalyticsTabOnOffNet from './containers/analytics/tabs/tab-on-off-net.jsx'
import AnalyticsTabServiceProviders from './containers/analytics/tabs/tab-service-providers.jsx'
import AnalyticsTabFileError from './containers/analytics/tabs/tab-file-error.jsx'
import AnalyticsTabUrlReport from './containers/analytics/tabs/tab-url-report.jsx'
import AnalyticsTabPlaybackDemo from './containers/analytics/tabs/tab-playback-demo.jsx'
import Accounts from './containers/accounts'
import Configuration from './containers/configuration'
import Configurations from './containers/configurations'
import ForgotPassword from './containers/forgot-password'
import Groups from './containers/groups'
import Hosts from './containers/hosts'
import Login from './containers/login'
import Main from './containers/main'
import NotFoundPage from './containers/not-found-page'
import Property from './containers/property'
import Purge from './containers/configure/purge'
import Security from './containers/security'
import Services from './containers/services'
import SetPassword from './containers/set-password'
import Support from './containers/support/support'
import SupportTabTickets from './containers/support/tabs/tickets'
import SupportTabTools from './containers/support/tabs/tools'
import SupportTabDocumentation from './containers/support/tabs/documentation'
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

  accountManagementTabAccountDetails: 'details',
  accountManagementTabAccountGroups: 'groups',
  accountManagementTabAccountUsers: 'users',

  accountManagementTabSystemAccounts: 'accounts',
  accountManagementTabSystemUsers: 'users',
  accountManagementTabSystemBrands: 'brands',
  accountManagementTabSystemDNS: 'dns',
  accountManagementTabSystemRoles: 'roles',
  accountManagementTabSystemServices: 'services',

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

  supportTabTickets: 'tickets',
  supportTabTools: 'tools',
  supportTabDocumentation: 'documentation',

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

const analyticsTabs = [
  [PERMISSIONS.VIEW_ANALYTICS_TRAFFIC_OVERVIEW, routes.analyticsTabTraffic, AnalyticsTabTraffic],
  [PERMISSIONS.VIEW_ANALYTICS_SP_ON_OFF_NET, routes.analyticsTabOnOffNet, AnalyticsTabOnOffNet],
  [PERMISSIONS.VIEW_ANALYTICS_SP_CONTRIBUTION, routes.analyticsTabServiceProviders, AnalyticsTabServiceProviders],
  [PERMISSIONS.VIEW_ANALYTICS_UNIQUE_VISITORS, routes.analyticsTabVisitors, AnalyticsTabVisitors],
  [PERMISSIONS.VIEW_ANALYTICS_FILE_ERROR, routes.analyticsTabFileError, AnalyticsTabFileError],
  [PERMISSIONS.VIEW_ANALYTICS_URL, routes.analyticsTabUrlReport, AnalyticsTabUrlReport],
  [null, routes.analyticsTabPlaybackDemo, AnalyticsTabPlaybackDemo]
]

/* helper for creating Analytics Tab-Routes */
const getAnalyticsTabRoutes = store => <Route>
  <IndexRedirect to={routes.analyticsTabTraffic} />
  {analyticsTabs.map(([permission, path, component], i) => <Route
    path={path} key={i}
    component={UserCanViewAnalyticsTab(permission, store, analyticsTabs)(component)} />
  )}
</Route>

/* helper for creating Support Tab-Routes */
function getSupportTabRoutes() {
  return (
    <Route>
      <IndexRedirect to={routes.supportTabTickets} />
      <Route path={routes.supportTabTickets} component={SupportTabTickets} />
      <Route path={routes.supportTabTools} component={SupportTabTools} />
      <Route path={routes.supportTabDocumentation} component={SupportTabDocumentation} />
    </Route>
  )
}

export const getRoutes = store => {

  return (
    <Route path="/" component={Main}>
      <IndexRedirect to={getRoute('content', {brand: 'udn'})} />
      <Route path="starburst-help" component={StarburstHelp}/>
      <Route path="styleguide" component={Styleguide}/>
      <Route path="configure/purge" component={Purge}/>
      <Route path="/login" component={Login}/>
      <Route path="/set-password" component={SetPassword}/>
      <Route path="/forgot-password" component={ForgotPassword}/>

      {/* Analytics - routes */}
      <Route path={routes.analytics} component={UserHasPermission(PERMISSIONS.VIEW_ANALYTICS_SECTION, store)} >
        {/* default - set 'udn' as brand */}
        <IndexRedirect to="udn" />
        <Route path={routes.analyticsBrand} component={UserCanListAccounts(store)(AnalyticsContainer)} />
        <Route path={routes.analyticsAccount} component={AnalyticsContainer}>
            {getAnalyticsTabRoutes(store)}
        </Route>
        <Route path={routes.analyticsGroup} component={AnalyticsContainer}>
            {getAnalyticsTabRoutes(store)}
        </Route>
        <Route path={routes.analyticsProperty} component={AnalyticsContainer}>
            {getAnalyticsTabRoutes(store)}
        </Route>
      </Route>

      {/* Content - routes */}
      <Route path={routes.content} component={UserHasPermission(PERMISSIONS.VIEW_CONTENT_SECTION, store)}>
        <IndexRedirect to={getRoute('contentBrand', {brand: 'udn'})} />
        <Route component={ContentTransition}>
          <Route path={routes.contentBrand} component={UserCanListAccounts(store)(Accounts)}/>
          <Route path={routes.contentAccount} component={Groups}/>
          <Route path={routes.contentGroup} component={Hosts}/>
        </Route>
        <Route path={routes.contentProperty} component={Property} />
        <Route path={routes.contentPropertyAnalytics} component={AnalyticsContainer} >
          {getAnalyticsTabRoutes(store)}
        </Route>
        <Route path={routes.contentPropertyConfiguration} component={Configuration} />
      </Route>

      <Route path="/configurations">
        <Route path=":brand" component={Configurations}/>
      </Route>

      {/* Security - routes */}
      <Route path={routes.security} component={UserHasPermission(PERMISSIONS.VIEW_SECURITY_SECTION, store)}>
        <IndexRedirect to={getRoute('securityBrand', {brand: 'udn'})} />
        <Route path={routes.securityBrand} component={UserCanListAccounts(store)(Security)} />
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
      <Route path={routes.services} component={UserHasPermission(PERMISSIONS.VIEW_SERVICES_SECTION, store)}>
        <IndexRedirect to={getRoute('servicesBrand', {brand: 'udn'})} />
        <Route path={routes.servicesBrand} component={UserCanListAccounts(store)(Services)}/>
        <Route path={routes.servicesAccount} component={Services}/>
        <Route path={routes.servicesGroup} component={Services}/>
        <Route path={routes.servicesProperty} component={Services}/>
      </Route>

      {/* Support - routes */}
      <Route path={routes.support} component={UserHasPermission(PERMISSIONS.VIEW_SUPPORT_SECTION, store)}>
        <IndexRedirect to={getRoute('supportBrand', {brand: 'udn'})} />
        <Route path={routes.supportBrand} component={UserCanTicketAccounts(store)(Support)}>
            {getSupportTabRoutes()}
        </Route>
        <Route path={routes.supportAccount} component={Support}>
            {getSupportTabRoutes()}
        </Route>
        <Route path={routes.supportGroup} component={Support}>
            {getSupportTabRoutes()}
        </Route>
        <Route path={routes.supportProperty} component={Support}>
            {getSupportTabRoutes()}
        </Route>
      </Route>

      {/* Account management - routes */}
      <Route path={routes.accountManagement} component={UserHasPermission(PERMISSIONS.VIEW_ACCOUNT_SECTION, store)}>
        <IndexRedirect to={getRoute('accountManagementBrand', {brand: 'udn'})} />
        <Route path={routes.accountManagementBrand} component={UserCanManageAccounts(store)(AccountManagement)}>
          <IndexRedirect to={routes.accountManagementTabSystemAccounts}/>
          <Route path={routes.accountManagementTabSystemAccounts} component={AccountManagementAccounts}/>
          <Route path={routes.accountManagementTabSystemUsers} component={AccountManagementSystemUsers}/>
          <Route path={routes.accountManagementTabSystemBrands} component={AccountManagementBrands}/>
          <Route path={routes.accountManagementTabSystemDNS} component={UserCanViewDns(store)(AccountManagementDNS)}/>
          <Route path={routes.accountManagementTabSystemRoles} component={AccountManagementRoles}/>
          <Route path={routes.accountManagementTabSystemServices} component={AccountManagementServices}/>
        </Route>
        <Route path={routes.accountManagementAccount} component={AccountManagement}>
          <IndexRedirect to={routes.accountManagementTabAccountDetails}/>
          <Route path={routes.accountManagementTabAccountDetails} component={AccountManagementAccount}/>
          <Route path={routes.accountManagementTabAccountGroups} component={AccountManagementGroups}/>
          <Route path={routes.accountManagementTabAccountUsers} component={AccountManagementAccountUsers}/>
        </Route>
        <Route path={routes.accountManagementGroup} component={AccountManagement}>
          <IndexRedirect to={routes.accountManagementTabAccountDetails}/>
          <Route path={routes.accountManagementTabAccountDetails} component={AccountManagementAccount}/>
          <Route path={routes.accountManagementTabAccountGroups} component={AccountManagementGroups}/>
          <Route path={routes.accountManagementTabAccountUsers} component={AccountManagementAccountUsers}/>
        </Route>
        <Route path={routes.accountManagementProperty} component={AccountManagement}>
          <IndexRedirect to={routes.accountManagementTabAccountDetails}/>
          <Route path={routes.accountManagementTabAccountDetails} component={AccountManagementAccount}/>
          <Route path={routes.accountManagementTabAccountGroups} component={AccountManagementGroups}/>
          <Route path={routes.accountManagementTabAccountUsers} component={AccountManagementAccountUsers}/>
        </Route>
      </Route>

      <Route path="*" component={NotFoundPage} />
    </Route>
  )
}
