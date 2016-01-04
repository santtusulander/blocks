import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Main from './containers/main'
import Home from './containers/home'
import Styleguide from './containers/styleguide'
import Edge from './containers/configure/edge'
import Purge from './containers/configure/purge'
import Login from './containers/login'

module.exports = (
  <Route path="/" component={Main}>
    <IndexRoute component={Home}/>
    <Route path="styleguide" component={Styleguide}/>
    <Route path="configure/edge" component={Edge}/>
    <Route path="configure/purge" component={Purge}/>
    <Route path="login" component={Login}/>
  </Route>
);
