import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Main from './containers/main'
import Home from './containers/home'
import Styleguide from './containers/styleguide'
import Edge from './containers/configure/edge'

module.exports = (
  <Route path="/" component={Main}>
    <IndexRoute component={Home}/>
    <Route path="styleguide" component={Styleguide}/>
    <Route path="configure/edge" component={Edge}/>
  </Route>
);
