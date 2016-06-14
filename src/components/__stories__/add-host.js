import React from 'react';
import Immutable from 'immutable';
import {storiesOf, action} from '@kadira/storybook';

const ThemeWrap = require('./theme-wrap.jsx');
const AddHost = require('../add-host.jsx')

storiesOf('AddHost', module)
  .addDecorator((story) => (
    <ThemeWrap>
      {story()}
    </ThemeWrap>
  ))
  .add('Default', () => (
    <AddHost group={Immutable.Map()} cancelChanges={action('Cancel Changes')} createHost={action('Create Host')}/>
  ))
