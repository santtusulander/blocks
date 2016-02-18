import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Main from './containers/main'
import Home from './containers/home'
import Styleguide from './containers/styleguide'
import Purge from './containers/configure/purge'
import Login from './containers/login'
import Analysis from './containers/analysis'
import Accounts from './containers/accounts'
import Groups from './containers/groups'
import Hosts from './containers/hosts'
import Configuration from './containers/configuration'
import Configurations from './containers/configurations'

import Property from './components/property'

import ContentTransition from './transitions/content'

module.exports = (
  <Route path="/" component={Main}>
    <IndexRoute component={Home}/>
    <Route path="styleguide" component={Styleguide}/>
    <Route path="configure/purge" component={Purge}/>
    <Route path="login" component={Login}/>
    <Route path="analysis" component={Analysis}/>
    <Route path="configurations/:brand" component={Configurations}/>
    <Route path="content" component={ContentTransition}>
      <Route path="accounts/:brand" component={Accounts}/>
      <Route path="groups/:brand/:account" component={Groups}/>
      <Route path="hosts/:brand/:account/:group" component={Hosts}/>
    </Route>
    <Route path="property/:brand/:account/:group/property" component={Property}/>
    <Route path="configuration/:brand/:account/:group/property" component={Configuration}/>
  </Route>
);
