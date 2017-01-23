import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import ThemeWrap from './theme-wrap'
import Confirmation from '../confirmation'

storiesOf('Confirmation', module)
  .addDecorator((story) => (
    <ThemeWrap>
      {story()}
    </ThemeWrap>
  ))
  .add('Confirmation', () => (
    <Confirmation
      handleCancel={action('Handling cancel')}
      handleConfirm={action('Handling confirm')}
    />
  ));
