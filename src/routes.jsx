import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import Accounts from './containers/accounts'
import Configuration from './containers/configuration'
import Configurations from './containers/configurations'
import Property from './containers/property'
import GroupAnalytics from './containers/group-analytics'
import Groups from './containers/groups'
import Hosts from './containers/hosts'
import Login from './containers/login'
import Main from './containers/main'
import PropertyAnalytics from './containers/property-analytics'
import Purge from './containers/configure/purge'
import Security from './containers/security'
import Services from './containers/services'
import Styleguide from './containers/styleguide'

import ContentTransition from './transitions/content'

module.exports = (
  <Route path="/" component={Main}>
    <IndexRedirect to="/content/groups/udn/7" />
    <Route path="styleguide" component={Styleguide}/>
    <Route path="configure/purge" component={Purge}/>
    <Route path="login" component={Login}/>
    <Route path="configurations/:brand" component={Configurations}/>
    <Route path="content" component={ContentTransition}>
      <Route path="accounts/:brand" component={Accounts}/>
      <Route path="groups/:brand/:account" component={Groups}/>
      <Route path="hosts/:brand/:account/:group" component={Hosts}/>
    </Route>
    <Route path="property/:brand/:account/:group/property" component={Property}/>
    <Route path="configuration/:brand/:account/:group/property" component={Configuration}/>
    <Route path="/analytics/group/:brand/:account/:group" component={GroupAnalytics}/>
    <Route path="/analytics/property/:brand/:account/:group/property" component={PropertyAnalytics}/>
    <Route path="/security" component={Security}/>
    <Route path="/services" component={Services}/>
  </Route>
);
