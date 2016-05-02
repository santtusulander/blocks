import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

const Confirmation = require('../confirmation.jsx')

storiesOf('Confirmation', module)
  .add('Confirmation', () => (
    <Confirmation />
  ));