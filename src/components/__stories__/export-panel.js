import React from 'react';
import Immutable from 'immutable';
import { storiesOf, action } from '@kadira/storybook';

const ThemeWrap = require('./theme-wrap.jsx');
const ExportPanel = require('../export-panel.jsx');

storiesOf('ExportPanel', module)
  .addDecorator((story) => (
    <ThemeWrap theme='dark'>
      {story()}
    </ThemeWrap>
  ))
  .add('Download (dark)', () => (
      <ExportPanel activeTab={1} />
  ))
  .add('Email (dark)', () => (
      <ExportPanel activeTab={2}/>
  ))
