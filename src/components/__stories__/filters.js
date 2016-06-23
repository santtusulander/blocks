import React from 'react';
import {storiesOf, action} from '@kadira/storybook';

const ThemeWrap = require('./theme-wrap.jsx');

import Navigation from '../navigation/navigation.jsx'

storiesOf('Filters', module)
  .addDecorator((story) => (
    <ThemeWrap >
      {story()}
    </ThemeWrap>
  ))
  .add('Filters', () => (
    <div>
      <Filters />
    </div>
  ))
