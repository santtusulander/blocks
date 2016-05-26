import React from 'react';
import { storiesOf } from '@kadira/storybook';

const ThemeWrap = require('./theme-wrap.jsx');
const Confirmation = require('../confirmation.jsx')

storiesOf('Confirmation', module)
  .addDecorator((story) => (
    <ThemeWrap>
      {story()}
    </ThemeWrap>
  ))
  .add('Confirmation', () => (
    <Confirmation />
  ));
