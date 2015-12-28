import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Main from './containers/main'
import Home from './containers/home'
import Styleguide from './containers/styleguide'
import Hostname from './containers/configure/hostname'
import CacheRules from './containers/configure/cache-rules'

module.exports = (
  <Route path="/" component={Main}>
    <IndexRoute component={Home}/>
    <Route path="styleguide" component={Styleguide}/>
    <Route path="configure/hostname" component={Hostname}/>
    <Route path="configure/cache-rules" component={CacheRules}/>
  </Route>
);
