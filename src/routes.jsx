/* eslint-disable react/no-multi-comp */
import React from 'react'
import { Route, IndexRedirect, IndexRoute } from 'react-router'

import * as PERMISSIONS from './constants/permissions'
import routes, { ENTRY_ROUTE_ROOT } from './constants/routes'
import {
  UserHasPermission,
  UserCanListAccounts,
  UserCanViewAccountDetail,
  UserCanManageAccounts,
  UserCanTicketAccounts,
  UserCanViewAnalyticsTab,
  UserCanViewDns,
  UserCanViewHosts,
  CanViewConfigurationSecurity,
  CanViewStorageSummary,
  CanViewStorageTab
} from './util/route-permissions-wrappers'

import {
  accountIsServiceProviderType,
  accountIsContentProviderType,
  accountIsCloudProviderType
 } from './util/helpers'

import AccountManagement from './containers/account-management/account-management'
import AccountManagementAccountDetails from './containers/account-management/tabs/details'
import AccountManagementAccountUsers from './containers/account-management/tabs/users'
import AccountManagementGroups from './containers/account-management/tabs/groups'
import AccountManagementAccounts from './components/account-management/system/accounts'
import AccountManagementSystemUsers from './components/account-management/system/users'
import AccountManagementBrands from './components/account-management/system/brands'
import AccountManagementDNS from './containers/account-management/tabs/dns'
import AccountManagementStorages from './containers/account-management/tabs/storages'
import AccountManagementRoles from './components/account-management/system/roles'
import AccountManagementServices from './components/account-management/system/services'
import AnalyticsContainer from './containers/analytics/analytics-container.jsx'
import AnalyticsTabTraffic from './containers/analytics/tabs/tab-traffic.jsx'
import AnalyticsTabCacheHitRate from './containers/analytics/tabs/tab-cache-hit-rate.jsx'
import AnalyticsTabVisitors from './containers/analytics/tabs/tab-visitors.jsx'
import AnalyticsTabOnOffNet from './containers/analytics/tabs/tab-on-off-net.jsx'
import AnalyticsTabContribution from './containers/analytics/tabs/tab-contribution.jsx'
import AnalyticsTabStorage from './containers/analytics/tabs/tab-storage.jsx'
import AnalyticsTabFileError from './containers/analytics/tabs/tab-file-error.jsx'
import AnalyticsTabUrlReport from './containers/analytics/tabs/tab-url-report.jsx'
import AnalyticsTabPlaybackDemo from './containers/analytics/tabs/tab-playback-demo.jsx'
import ConfigurationDetails from './components/configuration/details'
import ConfigurationDefaults from './components/configuration/defaults'
import ConfigurationPolicies from './components/configuration/policies'
import ConfigurationSecurity from './components/configuration/security'
import ConfigurationStreaming from './components/configuration/streaming'

import Accounts from './containers/accounts'
import Configuration from './containers/configuration'
import Dashboard from './containers/dashboard'
// UDNP-2218: Route to "Having Trouble?" page. Not yet supported by backend.
// import HavingTrouble from './containers/having-trouble'
import Groups from './containers/groups'
import Network from './containers/network/network'
import Hosts from './containers/hosts'
import Login from './containers/login'
import Main from './containers/main'
import NotFoundPage from './containers/not-found-page'
import Property from './containers/property/property'
import PropertySummary from './containers/property/tabs/property-summary'
import PurgeStatus from './containers/property/tabs/purge-status'
import Purge from './containers/configure/purge'
import Security from './containers/security/security'
import SecurityTabSslCertificate from './containers/security/tabs/ssl-certificate'
import SecurityTabContentTargeting from './containers/security/tabs/content-targeting'
import SecurityTabTokenAuthentication from './containers/security/tabs/token-authentication'
import Services from './containers/services'
import Storage from './containers/storage/storage'
import ForgotPassword from './containers/password/forgot-password'
import SetPassword from './containers/password/set-password'
import Support from './containers/support/support'
import SupportTabTickets from './containers/support/tabs/tickets'
import SupportTabTools from './containers/support/tabs/tools'
import SupportTabDocumentation from './containers/support/tabs/documentation'
import StarburstHelp from './containers/starburst-help'
import Styleguide from './containers/styleguide'
import User from './containers/user'

import ContentTransition from './transitions/content'

import { getRoute } from './util/routes'

const analyticsTabs = [
  [PERMISSIONS.VIEW_ANALYTICS_TRAFFIC_OVERVIEW, routes.analyticsTabTraffic, AnalyticsTabTraffic],
  [PERMISSIONS.VIEW_ANALYTICS_SP_ON_OFF_NET, routes.analyticsTabOnOffNet, AnalyticsTabOnOffNet],
  [PERMISSIONS.VIEW_ANALYTICS_CACHE_HIT_RATE, routes.analyticsTabCacheHitRate, AnalyticsTabCacheHitRate],

  // TODO: Temporarily disabled as a part of UDNP-1534
  // [PERMISSIONS.VIEW_ANALYTICS_SP_CONTRIBUTION, routes.analyticsTabContribution, AnalyticsTabContribution],
  [PERMISSIONS.ALLOW_ALWAYS, routes.analyticsTabContribution, AnalyticsTabContribution],

  [PERMISSIONS.VIEW_ANALYTICS_STORAGE, routes.analyticsTabStorage, AnalyticsTabStorage],
  [PERMISSIONS.VIEW_ANALYTICS_STORAGE, routes.analyticsStorage, AnalyticsTabStorage],
  [PERMISSIONS.VIEW_ANALYTICS_UNIQUE_VISITORS, routes.analyticsTabVisitors, AnalyticsTabVisitors],
  [PERMISSIONS.VIEW_ANALYTICS_FILE_ERROR, routes.analyticsTabFileError, AnalyticsTabFileError],
  [PERMISSIONS.VIEW_ANALYTICS_URL, routes.analyticsTabUrlReport, AnalyticsTabUrlReport],
  [PERMISSIONS.VIEW_ANALYTICS_PLAYBACK_DEMO, routes.analyticsTabPlaybackDemo, AnalyticsTabPlaybackDemo]
]

/* helper for creating Analytics Tab-Routes */
// eslint-disable-next-line react/display-name
const getAnalyticsTabRoutes = (store) => {
  return (
    <Route>
      <IndexRedirect to={routes.analyticsTabTraffic} />
      {analyticsTabs.map(([permission, path, component], i) => {
        if (permission === null) {
          return <Route path={path} key={i} />
        }
        return (
          <Route
            path={path} key={i}
            component={UserCanViewAnalyticsTab(permission, store, analyticsTabs)(component)} />
        )
      })}
    </Route>
  )
}

/* helper for creating Support Tab-Routes */
const getSupportTabRoutes = () => {
  return (
    <Route>
      <IndexRedirect to={routes.supportTabTickets} />
      <Route path={routes.supportTabTickets} component={SupportTabTickets} />
      <Route path={routes.supportTabTools} component={SupportTabTools} />
      <Route path={routes.supportTabDocumentation} component={SupportTabDocumentation} />
    </Route>
  )
}
getSupportTabRoutes.displayName = "getSupportTabRoutes"

import { UserAuthWrapper } from 'redux-auth-wrapper'

const UserIsLoggedIn = UserAuthWrapper({
  authSelector: state => state.user,
  authenticatingSelector: state => state.user.get('fetching') && ( state.user.get('loggedIn') === false ),
  failureRedirectPath: '/login',
  wrapperDisplayName: 'UserIsLoggedIn',
  predicate: (user) => {
    return ( user && user.get('loggedIn') === true )
  },
  allowRedirectBack: true
})

const UserIsNotLoggedIn = UserAuthWrapper({
  authSelector: state => state.user,
  wrapperDisplayName: 'UserIsNotLoggedIn',
  predicate: (user) => user.get('loggedIn') === false,
  failureRedirectPath: (state, ownProps) => {
    const redirectPath = ownProps.location.query.redirect || ENTRY_ROUTE_ROOT

    return redirectPath

  },
  allowRedirectBack: false
})

const AccountIsSP = UserAuthWrapper({
  authSelector: (state, ownProps) => {
    const account =
      state.account.get('allAccounts').find((acc) => acc.get('id') === Number(ownProps.params.account)) ||
      state.account.get('activeAccount')
    return account
  },
  authenticatingSelector: (state) => state.account.get('fetching'),
  wrapperDisplayName: 'AccountIsSP',
  predicate: (account) => {
    if(!account) {
      return true
    } else {
      return accountIsServiceProviderType(account)
    }
  },
  failureRedirectPath: (state, ownProps) => {
    const redirectPath = ownProps.location.pathname.replace(new RegExp(/\/network\//, 'i'), '/content/')
    return redirectPath
  },
  allowRedirectBack: false
})

const AccountIsCP = UserAuthWrapper({
  authSelector: (state, ownProps) => {
    const account =
      state.account.get('allAccounts').find((acc) => acc.get('id') === Number(ownProps.params.account)) ||
      state.account.get('activeAccount')
    return {
      account,
      accountId: ownProps.params.account
    }

  },
  authenticatingSelector: (state) => state.account.get('fetching'),
  wrapperDisplayName: 'AccountIsCP',
  predicate: ({account}) => {
    if(!account) {
      return true
    } else {
      return accountIsContentProviderType(account) || accountIsCloudProviderType(account)
    }
  },
  failureRedirectPath: (state, ownProps) => {
    const redirectPath = ownProps.location.pathname.replace(new RegExp(/\/content\//, 'i'), '/network/')
    return redirectPath
  },
  allowRedirectBack: false
})

export const getRoutes = store => {
  return (
    <Route path={routes.root}>
      <Route path="/login" component={UserIsNotLoggedIn(Login)}/>
      <Route path="/forgot-password" component={UserIsNotLoggedIn(ForgotPassword)}/>
      {/*
        UDNP-2218: Route to "Having Trouble?" page. Not yet supported by backend.
        Should be used by 2FA components to allow user changing 2FA methods on demand.
        <Route path="/having-trouble" component={UserIsNotLoggedIn(HavingTrouble)}/>
      */}
      <Route path="/set-password/:token" component={UserIsNotLoggedIn(SetPassword)}/>
      <Route path="/reset-password/:token" component={UserIsNotLoggedIn(SetPassword)}/>
      <Route path="styleguide" component={UserIsNotLoggedIn(Styleguide)}/>

      { /* Routes below are protected by login*/}
      <IndexRoute component={UserIsLoggedIn(Main)} />
      <Route component={UserIsLoggedIn(Main)}>
        <Route path="starburst-help" component={StarburstHelp}/>
        <Route path="configure/purge" component={Purge}/>

        {/* Analytics - routes */}
        <Route path={routes.analytics} component={UserHasPermission(PERMISSIONS.VIEW_ANALYTICS_SECTION, store)} >
          {/* default - set 'udn' as brand */}
          <IndexRedirect to="udn" />
          <Route path={routes.analyticsBrand} component={UserCanListAccounts(store)(AnalyticsContainer)}>
            {getAnalyticsTabRoutes(store)}
          </Route>
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

        {/* Content / CP Accounts - routes */}
        <Route path={routes.content} component={AccountIsCP(UserHasPermission(PERMISSIONS.VIEW_CONTENT_SECTION, store))}>
          <IndexRedirect to={getRoute('contentBrand', {brand: 'udn'})} />
          <Route component={ContentTransition}>
            <Route path={routes.contentBrand} component={UserCanListAccounts(store)(Accounts)}/>
            <Route path={routes.contentAccount} component={UserCanViewAccountDetail(store)(Accounts)}/>
            <Route path={routes.contentGroups} component={Groups}/>
            <Route path={routes.contentGroup} component={UserCanViewHosts(store)(Hosts)}/>
          </Route>

          {/* Properties - routes */}
          <Route path={routes.contentProperty} component={Property}>
            <IndexRedirect to={routes.contentPropertyTabSummary}/>
            <Route path={routes.contentPropertyTabSummary} component={PropertySummary}/>
            <Route path={routes.contentPropertyTabPurgeStatus} component={PurgeStatus}/>
          </Route>

          {/* Property Configuration - routes */}
          <Route path={routes.contentPropertyConfiguration} component={Configuration}>
            <IndexRedirect to={routes.configurationTabDetails} />
            <Route path={routes.configurationTabDetails} component={ConfigurationDetails}/>
            <Route path={routes.configurationTabDefaults} component={ConfigurationDefaults}/>
            <Route path={routes.configurationTabSecurity} component={CanViewConfigurationSecurity(store)(ConfigurationSecurity)}/>
            <Route path={routes.configurationTabPolicies} component={ConfigurationPolicies}>
              <Route path={routes.configurationTabPoliciesEditPolicy}/>
            </Route>
            <Route path={routes.configurationTabStreaming} component={ConfigurationStreaming}/>
          </Route>

          {/* Storage - routes */}
          <Route path={routes.contentStorage} component={CanViewStorageSummary(store)(Storage)} />

        </Route>

        {/* Network / SP Accounts - routes */}
        <Route path={routes.network} component={AccountIsSP(UserHasPermission(PERMISSIONS.VIEW_NETWORK_SECTION, store))}>
          <IndexRedirect to={getRoute('networkBrand', {brand: 'udn'})} />
          <Route component={ContentTransition}>
            <Route path={routes.networkBrand} component={UserCanListAccounts(store)(Accounts)}/>
            <Route path={routes.networkAccount} component={UserCanViewAccountDetail(store)(Network)}/>
          </Route>
          <Route path={routes.networkGroups} component={Network}/>
          <Route path={routes.networkGroup} component={Network}/>
          <Route path={routes.networkNetwork} component={Network}/>
          <Route path={routes.networkPop} component={Network}/>
          <Route path={routes.networkPod} component={Network}/>
        </Route>

        {/* Security - routes */}
        <Route path={routes.security} component={UserHasPermission(PERMISSIONS.VIEW_SECURITY_SECTION, store)}>
          <IndexRedirect to={getRoute('securityBrand', {brand: 'udn'})} />
          <Route path={routes.securityBrand} component={UserCanListAccounts(store)(Security)} />
          <Route path={routes.securityAccount} component={Security}>
            <IndexRedirect to={routes.securityTabSslCertificate} />
            <Route path={routes.securityTabSslCertificate} component={SecurityTabSslCertificate}/>
            <Route path={routes.securityTabContentTargeting} component={SecurityTabContentTargeting}/>
            <Route path={routes.securityTabTokenAuthentication} component={SecurityTabTokenAuthentication}/>
          </Route>
          <Route path={routes.securityGroup} component={Security}>
            <IndexRedirect to={routes.securityTabSslCertificate} />
            <Route path={routes.securityTabSslCertificate} component={SecurityTabSslCertificate}/>
            <Route path={routes.securityTabContentTargeting} component={SecurityTabContentTargeting}/>
            <Route path={routes.securityTabTokenAuthentication} component={SecurityTabTokenAuthentication}/>
          </Route>

          <Route path={routes.securityProperty} component={Security}>
            <IndexRedirect to={routes.securityTabSslCertificate} />
            <Route path={routes.securityTabSslCertificate} component={SecurityTabSslCertificate}/>
            <Route path={routes.securityTabContentTargeting} component={SecurityTabContentTargeting}/>
            <Route path={routes.securityTabTokenAuthentication} component={SecurityTabTokenAuthentication}/>
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
            <Route path={routes.accountManagementTabAccountDetails} component={AccountManagementAccountDetails}/>
            <Route path={routes.accountManagementTabAccountGroups} component={AccountManagementGroups}/>
            <Route path={routes.accountManagementTabAccountUsers} component={AccountManagementAccountUsers}/>
            <Route path={routes.accountManagementTabSystemStorages} component={CanViewStorageTab(store)(AccountManagementStorages)}/>
          </Route>
          <Route path={routes.accountManagementGroup} component={AccountManagement}>
            <IndexRedirect to={routes.accountManagementTabAccountDetails}/>
            <Route path={routes.accountManagementTabAccountDetails} component={AccountManagementAccountDetails}/>
            <Route path={routes.accountManagementTabAccountGroups} component={AccountManagementGroups}/>
            <Route path={routes.accountManagementTabAccountUsers} component={AccountManagementAccountUsers}/>
            <Route path={routes.accountManagementTabSystemStorages} component={CanViewStorageTab(store)(AccountManagementStorages)}/>
          </Route>
          <Route path={routes.accountManagementProperty} component={AccountManagement}>
            <IndexRedirect to={routes.accountManagementTabAccountDetails}/>
            <Route path={routes.accountManagementTabAccountDetails} component={AccountManagementAccountDetails}/>
            <Route path={routes.accountManagementTabAccountGroups} component={AccountManagementGroups}/>
            <Route path={routes.accountManagementTabAccountUsers} component={AccountManagementAccountUsers}/>
            <Route path={routes.accountManagementTabSystemStorages} component={CanViewStorageTab(store)(AccountManagementStorages)}/>
          </Route>
        </Route>

        {/* User preferences - routes */}
        <Route path={routes.user}>
          <IndexRedirect to={getRoute('userBrand', {brand: 'udn'})} />
          <Route path={routes.userBrand} component={User}/>
          <Route path={routes.userAccount} component={User}/>
        </Route>

        {/* Dashboard - routes */}
        <Route path={routes.dashboard} component={UserHasPermission(PERMISSIONS.VIEW_DASHBOARD_SECTION, store)}>
          <IndexRedirect to={getRoute('dashboardBrand', {brand: 'udn'})} />
          <Route path={routes.dashboardBrand} component={Dashboard}/>
          <Route path={routes.dashboardAccount} component={Dashboard}/>
          <Route path={routes.dashboardGroup} component={Dashboard}/>
          <Route path={routes.dashboardProperty} component={Dashboard}/>
        </Route>
      </Route>
      <Route path="*" component={NotFoundPage} />
    </Route>
  )
}
getRoutes.displayName = "getRoutes"
