import React from 'react';
import { storiesOf } from '@kadira/storybook';

const ThemeWrap = require('./theme-wrap.jsx');

import LoadingSpinner from '../loading-spinner/loading-spinner.jsx'

storiesOf('LoadingSpinner', module)
  .addDecorator((story) => (
    <ThemeWrap >
      {story()}
    </ThemeWrap>
  ))
  .add('LoadingSpinner', () => (
    <LoadingSpinner />
  ))
