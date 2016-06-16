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
import Styleguide from './containers/styleguide'

import ContentTransition from './transitions/content'

//Analytics v2
import AnalyticsContainer from './containers/analytics/analytics-container.jsx'

import AnalyticsBrand from './containers/analytics/brand.jsx'
import AnalyticsGroup from './containers/analytics/group.jsx'
import AnalyticsAccount from './containers/analytics/account.jsx'
import AnalyticsProperty from './containers/analytics/property.jsx'

import AnalyticsTabTraffic from './containers/analytics/tabs/tab-traffic.jsx'
import AnalyticsTabVisitors from './containers/analytics/tabs/tab-visitors.jsx'

function getAnalyticsTabRoutes() {
  return (
    <span>
      <Route path="traffic" component={ AnalyticsTabTraffic } />
      <Route path="visitors" component={ AnalyticsTabVisitors } />

      <IndexRedirect to="traffic" />
    </span>
  )
}

module.exports = (
  <Route path="/" component={Main}>
    <IndexRedirect to="/content/accounts/udn" />
    <Route path="styleguide" component={Styleguide}/>
    <Route path="configure/purge" component={Purge}/>
    <Route path="/login" component={Login}/>

    <Route path="/v2-analytics" component={AnalyticsContainer}>
      <IndexRedirect to="udn" />
      <Route path=":brand" component={AnalyticsBrand} >
        <Route path=":account" component={AnalyticsAccount}>
          { getAnalyticsTabRoutes() }
          <Route path=":group" component={AnalyticsGroup}>
            { getAnalyticsTabRoutes() }
            <Route path=":property" component={AnalyticsProperty}>
              { getAnalyticsTabRoutes() }
            </Route>
          </Route>
      </Route>
    </Route>



          {/* TODO: Add tab routes
           <Route path=":account/visitors" components={{ main: AnalyticsAccount, tab: AnalyticsSidebarAccount }} >
           <Route path=":account/on-off-net" components={{ main: AnalyticsAccount, tab: AnalyticsSidebarAccount }} >
           <Route path=":account/service-providers" components={{ main: AnalyticsAccount, tab: AnalyticsSidebarAccount }} >
           <Route path=":account/file-error" components={{ main: AnalyticsAccount, tab: AnalyticsSidebarAccount }} >
           <Route path=":account/url-report" components={{ main: AnalyticsAccount, tab: AnalyticsSidebarAccount }} >
           <Route path=":account/playback-demo" components={{ main: AnalyticsAccount, tab: AnalyticsSidebarAccount }} >

           <Route path=":group" components={{ main: AnalyticsGroup, sidebar: AnalyticsSidebarGroup }} >
           <Route path=":property" components={{ main: AnalyticsProperty, sidebar: AnalyticsSidebarProperty }} />
           </Route>
           */}

    </Route>

    <Route path="/content">
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
    <Route path="/security" component={Security}/>
    <Route path="/services" component={Services}/>
    {/* TODO: This is temporary until the user api is managing permissions */}
    <Route path="/account-management/:account" component={AccountManagement}/>
    <Route path="/account-management" component={AccountManagement}/>
  </Route>
);
