import React from 'react';
import {storiesOf, action} from '@kadira/storybook';

const ThemeWrap = require('./theme-wrap.jsx');
const ExportEmailForm = require('../export-email-form.jsx');

storiesOf('ExportEmailForm', module)
  .addDecorator((story) => (
    <ThemeWrap >
      <div style={{width: '70%', padding: '3%', border: '1px solid #ccc'}}>
        {story()}
      </div>
    </ThemeWrap>
  ))
  .add('ExportEmailForm', () => (
      <ExportEmailForm  onSend={action('onSend')} onCancel={action('onCancel')}  changeValue={action('changeValue')} />
  ))
