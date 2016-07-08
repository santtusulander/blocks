import React from 'react';
import {storiesOf} from '@kadira/storybook';
import { fromJS } from 'immutable'
// import {createStore, combineReducers} from 'redux'
// import {Provider} from 'react-redux'

import AccountSelector from './selector-component.jsx'

const ThemeWrap = require('./theme-wrap.jsx');


// const reducer = combineReducers({reducer: () => {return {}}});
// const store = createStore(reducer);

storiesOf('Account selector', module)
  .addDecorator((story) => (
    <ThemeWrap >
        {story()}
    </ThemeWrap>
  ))
  .add('default', () => (
    <div>
      <AccountSelector items={fromJS([{ name: 'aa', id: 1 }, { name: 'bb', id: 2 }])}>
        Group
      </AccountSelector>
    </div>
  ))
