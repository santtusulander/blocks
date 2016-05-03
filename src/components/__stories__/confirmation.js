import React from 'react';
import { storiesOf } from '@kadira/storybook';

const Confirmation = require('../confirmation.jsx')

storiesOf('Confirmation', module)
  .add('Confirmation', () => (
    <Confirmation />
  ));
