import React from 'react';
import Immutable from 'immutable';
import { storiesOf, action } from '@kadira/storybook';

const AddHost = require('../add-host.jsx')

storiesOf('AddHost', module)
  .add('Default', () => (
    <AddHost group={Immutable.Map()} cancelChanges={action('Cancel Changes')} createHost={action('Create Host')}/>
  ))
