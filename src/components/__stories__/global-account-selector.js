import React from 'react';
import {storiesOf} from '@kadira/storybook';
import { fromJS } from 'immutable'

const ThemeWrap = require('./theme-wrap.jsx');

import AccountSelector from '../global-account-selector.jsx'

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
