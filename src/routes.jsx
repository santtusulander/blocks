import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Main from './containers/main'
import Home from './containers/home'
import Styleguide from './containers/styleguide'
import Edge from './containers/configure/edge'
import Purge from './containers/configure/purge'
import Login from './containers/login'
import Accounts from './containers/accounts'
import Groups from './containers/groups'
import Hosts from './containers/hosts'
import Configurations from './containers/configurations'

module.exports = (
  <Route path="/" component={Main}>
    <IndexRoute component={Home}/>
    <Route path="styleguide" component={Styleguide}/>
    <Route path="configure/edge" component={Edge}/>
    <Route path="configure/purge" component={Purge}/>
    <Route path="login" component={Login}/>
    <Route path="accounts/:brand" component={Accounts}/>
    <Route path="groups/:brand/:account" component={Groups}/>
    <Route path="hosts/:brand/:account/:group" component={Hosts}/>
    <Route path="configurations/:brand/:account/:group/:host" component={Configurations}/>
  </Route>
);
