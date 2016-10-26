import React from 'react';
import { storiesOf } from '@kadira/storybook';

const ThemeWrap = require('./theme-wrap.jsx');

import Navigation from '../navigation/navigation.jsx'

storiesOf('Navigation', module)
  .addDecorator((story) => (
    <ThemeWrap >
      {story()}
    </ThemeWrap>
  ))
  .add('Navigation', () => (
    <div style={{ width: '90px' }}>
      <Navigation />
    </div>
  ))
