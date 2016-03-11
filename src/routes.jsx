import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import AccountAnalytics from './containers/account-analytics'
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

module.exports = (
  <Route path="/" component={Main}>
    <IndexRedirect to="/login" />
    <Route path="styleguide" component={Styleguide}/>
    <Route path="configure/purge" component={Purge}/>
    <Route path="/login" component={Login}/>
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
  </Route>
);
