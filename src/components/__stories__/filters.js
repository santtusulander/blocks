/* eslint-disable react/jsx-no-undef */
import React from 'react';
import { storiesOf } from '@kadira/storybook';

const ThemeWrap = require('./theme-wrap.jsx');

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
