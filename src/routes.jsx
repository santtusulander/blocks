import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Main from './containers/main'
import Home from './containers/home'
import Styleguide from './containers/styleguide'
import AdvancedCacheRules from './containers/configure/advanced-cache-rules'
import AddAdvancedHeaderRule from './containers/configure/add-advanced-header-rule'
import Edge from './containers/configure/edge'

module.exports = (
  <Route path="/" component={Main}>
    <IndexRoute component={Home}/>
    <Route path="styleguide" component={Styleguide}/>
    <Route path="configure/advanced-cache-rules" component={AdvancedCacheRules}/>
    <Route path="configure/add-advanced-header-rule" component={AddAdvancedHeaderRule}/>
    <Route path="configure/edge" component={Edge}/>
  </Route>
);
