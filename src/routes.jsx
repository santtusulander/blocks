/* eslint-disable react/no-multi-comp */
import React from 'react'
import { Route, IndexRedirect, IndexRoute } from 'react-router'
import { UserAuthWrapper } from 'redux-auth-wrapper'

import { getById as getAccountById } from './redux/modules/entities/accounts/selectors'
import { getFetchingByTag } from './redux/modules/fetching/selectors'

import * as PERMISSIONS from './constants/permissions'
import routes, { ENTRY_ROUTE_ROOT } from './constants/routes'
import {
  UserHasPermission,
  UserCanListAccounts,
  UserCanViewAccountDetail,
  UserCanViewAnalyticsTab,
  UserCanViewDns,
  UserCanViewHosts,
  CanViewConfigurationSecurity,
  CanViewStorageSummary,
  CanViewStorageTab,
  CanViewBrandDashboard,
  UserCanViewGTM,
  UserCanViewAdvancedTab,
  AccountCanViewProperties
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
import AccountManagementProperties from './containers/account-management/tabs/properties'
import AccountManagementAccounts from './containers/account-management/tabs/accounts'
import AccountManagementSystemUsers from './containers/account-management/tabs/users'
import AccountManagementBrands from './components/account-management/system/brands'
import AccountManagementDNS from './containers/account-management/tabs/dns'
import AccountManagementStorages from './containers/account-management/tabs/storages'
import AccountManagementRoles from './containers/account-management/tabs/roles'
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
import ConfigurationGlobalTrafficManager from './components/configuration/gtm'
import ConfigurationAdvanced from './components/configuration/advanced'

import BrandContainer from './containers/content/brand'
import Configuration from './containers/configuration'
import Dashboard from './containers/dashboard'
import BrandDashboard from './containers/brand-dashboard'
import RecoveryKey from './components/login/login-form-two-factor-recovery-key'
import AccountContainer from './containers/content/account'
import Network from './containers/network/network'

import GroupContainer from './containers/content/group'

import Login from './containers/login'
import Main from './containers/main'
import Home from './containers/home'
import NotFoundPage from './containers/not-found-page'
import Property from './containers/property/property'
import PropertySummary from './containers/property/tabs/property-summary'
import PurgeStatus from './containers/property/tabs/purge-status'
import Purge from './containers/configure/purge'
import Security from './containers/security/security'
import SecurityTabSslCertificate from './containers/security/tabs/ssl-certificate'
import SecurityTabContentTargeting from './containers/security/tabs/content-targeting'
import SecurityTabTokenAuthentication from './containers/security/tabs/token-authentication'
import Services from './containers/services/services'
import ServicesTabLogDelivery from './containers/services/tabs/log-delivery-service'
import Storage from './containers/storage/storage'
import ForgotPassword from './containers/password/forgot-password'
import SetPassword from './containers/password/set-password'
import Support from './containers/support/support'
import SupportTabTickets from './containers/support/tabs/tickets'
import SupportTabTools from './containers/support/tabs/tools'
import SupportTabDocumentation from './containers/support/tabs/documentation'
import StarburstHelp from './containers/starburst-help'
import Styleguide from './containers/styleguide/styleguide'
import User from './containers/user'

import ContentTransition from './transitions/content'

import { getRoute, getDashboardUrlFromParams, getContentUrlFromParams } from './util/routes'

const analyticsTabs = [
  [PERMISSIONS.VIEW_ANALYTICS_TRAFFIC_OVERVIEW, routes.analyticsTabTraffic, AnalyticsTabTraffic],
  [PERMISSIONS.VIEW_ANALYTICS_SP_ON_OFF_NET, routes.analyticsTabOnOffNet, AnalyticsTabOnOffNet],
  [PERMISSIONS.VIEW_ANALYTICS_CACHE_HIT_RATE, routes.analyticsTabCacheHitRate, AnalyticsTabCacheHitRate],

  // TODO: Temporarily disabled as a part of UDNP-1534
  // [PERMISSIONS.VIEW_ANALYTICS_SP_CONTRIBUTION, routes.analyticsTabContribution, AnalyticsTabContribution],
  [PERMISSIONS.ALLOW_ALWAYS, routes.analyticsTabContribution, AnalyticsTabContribution],

  [PERMISSIONS.VIEW_ANALYTICS_STORAGE, routes.analyticsTabStorage, AnalyticsTabStorage],
  [PERMISSIONS.VIEW_ANALYTICS_UNIQUE_VISITORS, routes.analyticsTabVisitors, AnalyticsTabVisitors],
  [PERMISSIONS.VIEW_ANALYTICS_FILE_ERROR, routes.analyticsTabFileError, AnalyticsTabFileError],
  [PERMISSIONS.VIEW_ANALYTICS_URL, routes.analyticsTabUrlReport, AnalyticsTabUrlReport],
  [PERMISSIONS.VIEW_ANALYTICS_PLAYBACK_DEMO, routes.analyticsTabPlaybackDemo, AnalyticsTabPlaybackDemo]
]

/* helper for creating Analytics Tab-Routes */
// eslint-disable-next-line react/display-name
const getAnalyticsTabRoutes =
  (
    <Route>
      <IndexRedirect to={routes.analyticsTabTraffic} />
      {analyticsTabs.map(([permission, path, component], i) => {
        if (permission === null) {
          return <Route path={path} key={i} />
        }
        return (
          <Route
            path={path} key={i}
            component={UserCanViewAnalyticsTab(permission, analyticsTabs)(component)} />
        )
      })}
    </Route>
  )

/* helper for creating Support Tab-Routes */
const getSupportTabRoutes =
  (
    <Route>
      <IndexRedirect to={routes.supportTabTickets} />
      <Route path={routes.supportTabTickets} component={SupportTabTickets} />
      <Route path={routes.supportTabTools} component={SupportTabTools} />
      <Route path={routes.supportTabDocumentation} component={SupportTabDocumentation} />
    </Route>
  )



const UserIsLoggedIn = UserAuthWrapper({
  authSelector: state => state.user,
  authenticatingSelector: state => state.user.get('fetching') && (state.user.get('loggedIn') === false),
  failureRedirectPath: '/login',
  wrapperDisplayName: 'UserIsLoggedIn',
  predicate: (user) => {
    return (user && user.get('loggedIn') === true)
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
      getAccountById(state, ownProps.params.account)
    return account
  },
  authenticatingSelector: (state) => getFetchingByTag(state, 'accounts'),
  wrapperDisplayName: 'AccountIsSP',
  predicate: (account) => {
    if (!account) {
      return true
    } else {
      return accountIsServiceProviderType(account)
    }
  },
  failureRedirectPath: (state, ownProps) => {
    return getContentUrlFromParams(ownProps.params)
  },
  allowRedirectBack: false
})


const AccountIsCP = UserAuthWrapper({
  authSelector: (state, ownProps) => {
    const account =
      getAccountById(state, ownProps.params.account)
    return {
      account,
      accountId: ownProps.params.account
    }

  },
  authenticatingSelector: (state) => getFetchingByTag(state, 'accounts'),
  wrapperDisplayName: 'AccountIsCP',
  predicate: ({account}) => {
    if (!account) {
      return true
    } else {
      return accountIsContentProviderType(account) || accountIsCloudProviderType(account)
    }
  },
  failureRedirectPath: (state, ownProps) => {
    return getDashboardUrlFromParams(ownProps.params)
  },
  allowRedirectBack: false
})

const AppRoutes =
  (
    <Route path={routes.root}>
      <Route path="/login" component={UserIsNotLoggedIn(Login)}/>
      <Route path="/forgot-password" component={UserIsNotLoggedIn(ForgotPassword)}/>
      <Route path="/recovery-key" component={UserIsNotLoggedIn(RecoveryKey)}/>
      <Route path="/set-password/:token" component={UserIsNotLoggedIn(SetPassword)}/>
      <Route path="/reset-password/:token" component={UserIsNotLoggedIn(SetPassword)}/>
      <Route path="styleguide" component={UserIsNotLoggedIn(Styleguide)}/>

      { /* Routes below are protected by login
      <IndexRoute component={UserIsLoggedIn(Main)} />
      */}
      <Route component={UserIsLoggedIn(Main)}>

        {/* redirect to /home if in root */}
        <IndexRedirect to={routes.home} />
        <Route path={routes.home} component={Home}/>

        <Route path="starburst-help" component={StarburstHelp}/>
        <Route path="configure/purge" component={Purge}/>

        {/* Analytics - routes */}
        <Route path={routes.analytics} component={UserCanListAccounts('analyticsAccount')(UserHasPermission(PERMISSIONS.VIEW_ANALYTICS_SECTION))} >
          {/* default - set 'udn' as brand */}
          <IndexRedirect to="udn" />
          <Route path={routes.analyticsBrand} component={AnalyticsContainer}>
            {getAnalyticsTabRoutes}
          </Route>
          <Route path={routes.analyticsAccount} component={AnalyticsContainer}>
              {getAnalyticsTabRoutes}
          </Route>
          <Route path={routes.analyticsGroup} component={AnalyticsContainer}>
              {getAnalyticsTabRoutes}
          </Route>

          <Route path={routes.analyticsStorage} component={AnalyticsContainer}>
              <IndexRoute component={UserCanViewAnalyticsTab(PERMISSIONS.VIEW_ANALYTICS_STORAGE, analyticsTabs)(AnalyticsTabStorage)} />
          </Route>

          <Route path={routes.analyticsProperty} component={AnalyticsContainer}>
              {getAnalyticsTabRoutes}
          </Route>

        </Route>



        {/* Content / CP Accounts - routes */}
        <Route path={routes.content} component={UserCanListAccounts('contentAccount')(AccountIsCP(UserHasPermission(PERMISSIONS.VIEW_CONTENT_SECTION)))}>
          <IndexRedirect to={getRoute('contentBrand', {brand: 'udn'})} />
          <Route component={ContentTransition}>
            <Route path={routes.contentBrand} component={BrandContainer}/>
            <Route path={routes.contentAccount} component={UserCanViewAccountDetail(BrandContainer)}/>
            <Route path={routes.contentGroups} component={AccountContainer}/>
            <Route path={routes.contentGroup} component={UserCanViewHosts(GroupContainer)}/>
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
            <Route path={routes.configurationTabSecurity} component={CanViewConfigurationSecurity(ConfigurationSecurity)}/>
            <Route path={routes.configurationTabPolicies} component={ConfigurationPolicies}>
              <Route path={routes.configurationTabPoliciesEditPolicy}/>
            </Route>
            <Route path={routes.configurationTabGlobalTrafficManager} component={UserCanViewGTM(ConfigurationGlobalTrafficManager)}/>
            <Route path={routes.configurationTabAdvanced} component={UserCanViewAdvancedTab(ConfigurationAdvanced)}/>
          </Route>

          {/* Storage - routes */}
          <Route path={routes.contentStorage} component={CanViewStorageSummary(Storage)} />

        </Route>

        {/* Network / SP Accounts - routes */}
        <Route path={routes.network} component={UserCanListAccounts('networkAccount')(AccountIsSP(UserHasPermission(PERMISSIONS.VIEW_NETWORK_SECTION)))}>
          <IndexRedirect to={getRoute('networkBrand', {brand: 'udn'})} />
          <Route component={ContentTransition}>
            <Route path={routes.networkBrand} component={BrandContainer}/>
            <Route path={routes.networkAccount} component={UserCanViewAccountDetail(Network)}/>
          </Route>
          <Route path={routes.networkGroups} component={Network}/>
          <Route path={routes.networkGroup} component={Network}/>
          <Route path={routes.networkNetwork} component={Network}/>
          <Route path={routes.networkPop} component={Network}/>
          <Route path={routes.networkPod} component={Network}/>
        </Route>

        {/* Security - routes */}
        <Route path={routes.security} component={UserCanListAccounts('securityAccount')(UserHasPermission(PERMISSIONS.VIEW_SECURITY_SECTION))}>
          <IndexRedirect to={getRoute('securityBrand', {brand: 'udn'})} />
          <Route path={routes.securityBrand} component={Security} />
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
        <Route path={routes.services} component={UserCanListAccounts('servicesAccount')(UserHasPermission(PERMISSIONS.VIEW_SERVICES_SECTION))}>
          <IndexRedirect to={getRoute('servicesBrand', {brand: 'udn'})} />
          <Route path={routes.servicesBrand} component={Services}/>
          <Route path={routes.servicesAccount} component={Services}>
            <IndexRedirect to={routes.servicesTabLogDelivery}/>
            <Route path={routes.servicesTabLogDelivery} component={ServicesTabLogDelivery}/>
          </Route>
          <Route path={routes.servicesGroup} component={Services}>
            <IndexRedirect to={routes.servicesTabLogDelivery}/>
            <Route path={routes.servicesTabLogDelivery} component={ServicesTabLogDelivery}/>
          </Route>
          <Route path={routes.servicesProperty} component={Services}/>
        </Route>

        {/* Support - routes */}
        <Route path={routes.support} component={UserCanListAccounts('supportAccount')((UserHasPermission(PERMISSIONS.VIEW_SUPPORT_SECTION)))}>
          <IndexRedirect to={getRoute('supportBrand', {brand: 'udn'})} />
          <Route path={routes.supportBrand} component={Support}>
              {getSupportTabRoutes}
          </Route>
          <Route path={routes.supportAccount} component={Support}>
              {getSupportTabRoutes}
          </Route>
          <Route path={routes.supportGroup} component={Support}>
              {getSupportTabRoutes}
          </Route>
          <Route path={routes.supportProperty} component={Support}>
              {getSupportTabRoutes}
          </Route>
        </Route>

        {/* Account management - routes */}
        <Route path={routes.accountManagement} component={UserCanListAccounts('accountManagementAccount')(UserHasPermission(PERMISSIONS.VIEW_ACCOUNT_SECTION))}>
          <IndexRedirect to={getRoute('accountManagementBrand', {brand: 'udn'})} />
          <Route path={routes.accountManagementBrand} component={AccountManagement}>
            <IndexRedirect to={routes.accountManagementTabSystemAccounts}/>
            <Route path={routes.accountManagementTabSystemAccounts} component={AccountManagementAccounts}/>
            <Route path={routes.accountManagementTabSystemUsers} component={AccountManagementSystemUsers}/>
            <Route path={routes.accountManagementTabSystemBrands} component={AccountManagementBrands}/>
            <Route path={routes.accountManagementTabSystemDNS} component={UserCanViewDns(AccountManagementDNS)}/>
            <Route path={routes.accountManagementTabSystemRoles} component={AccountManagementRoles}/>
            <Route path={routes.accountManagementTabSystemServices} component={AccountManagementServices}/>
          </Route>
          <Route path={routes.accountManagementAccount} component={AccountManagement}>
            <IndexRedirect to={routes.accountManagementTabAccountDetails}/>
            <Route path={routes.accountManagementTabAccountDetails} component={AccountManagementAccountDetails}/>
            <Route path={routes.accountManagementTabAccountGroups} component={AccountManagementGroups}/>
            <Route path={routes.accountManagementTabAccountProperties} component={AccountCanViewProperties(AccountManagementProperties)}/>
            <Route path={routes.accountManagementTabAccountUsers} component={AccountManagementAccountUsers}/>
            <Route path={routes.accountManagementTabSystemStorages} component={CanViewStorageTab(AccountManagementStorages)}/>
          </Route>
          <Route path={routes.accountManagementGroup} component={AccountManagement}>
            <IndexRedirect to={routes.accountManagementTabAccountDetails}/>
            <Route path={routes.accountManagementTabAccountDetails} component={AccountManagementAccountDetails}/>
            <Route path={routes.accountManagementTabAccountGroups} component={AccountManagementGroups}/>
            <Route path={routes.accountManagementTabAccountProperties} component={AccountCanViewProperties(AccountManagementProperties)}/>
            <Route path={routes.accountManagementTabAccountUsers} component={AccountManagementAccountUsers}/>
            <Route path={routes.accountManagementTabSystemStorages} component={CanViewStorageTab(AccountManagementStorages)}/>
          </Route>
          <Route path={routes.accountManagementProperty} component={AccountManagement}>
            <IndexRedirect to={routes.accountManagementTabAccountDetails}/>
            <Route path={routes.accountManagementTabAccountDetails} component={AccountManagementAccountDetails}/>
            <Route path={routes.accountManagementTabAccountGroups} component={AccountManagementGroups}/>
            <Route path={routes.accountManagementTabAccountProperties} component={AccountCanViewProperties(AccountManagementProperties)}/>
            <Route path={routes.accountManagementTabAccountUsers} component={AccountManagementAccountUsers}/>
            <Route path={routes.accountManagementTabSystemStorages} component={CanViewStorageTab(AccountManagementStorages)}/>
          </Route>
        </Route>

        {/* User preferences - routes */}
        <Route path={routes.user}>
          <IndexRedirect to={getRoute('userBrand', {brand: 'udn'})} />
          <Route path={routes.userBrand} component={User}/>
          <Route path={routes.userAccount} component={User}/>
        </Route>

        {/* Dashboard - routes */}
        <Route path={routes.dashboard} component={UserCanListAccounts('dashboardAccount')(UserHasPermission(PERMISSIONS.VIEW_DASHBOARD_SECTION))}>
          <IndexRedirect to={getRoute('dashboardBrand', {brand: 'udn'})} />
          <Route path={routes.dashboardBrand} component={CanViewBrandDashboard(BrandDashboard)}/>
          <Route path={routes.dashboardAccount} component={Dashboard}/>
          <Route path={routes.dashboardGroup} component={Dashboard}/>
          <Route path={routes.dashboardProperty} component={Dashboard}/>
        </Route>
      </Route>
      <Route path="*" component={NotFoundPage} />
    </Route>
  )

export default AppRoutes
