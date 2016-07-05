import React from 'react';
import {storiesOf} from '@kadira/storybook';

const ThemeWrap = require('./theme-wrap.jsx');

import AccountSelector from '../global-account-selector.jsx'

storiesOf('Filters', module)
  .addDecorator((story) => (
    <ThemeWrap >
      {story()}
    </ThemeWrap>
  ))
  .add('Filters', () => (
    <div>
      <AccountSelector />
    </div>
  ))
