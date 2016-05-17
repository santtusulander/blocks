import React from 'react';
import Immutable from 'immutable';
import { storiesOf, action } from '@kadira/storybook';

const ThemeWrap = require('./theme-wrap.jsx');
const ExportPdfForm = require('../export-pdf-form.jsx');

storiesOf('ExportPdfForm', module)
  .addDecorator((story) => (
    <ThemeWrap >
      <div style={ {width: '70%', padding: '3%', border: '1px solid #ccc'} }>
        {story()}
      </div>
    </ThemeWrap>
  ))
  .add('ExportPdfForm', () => (
      <ExportPdfForm  onDownload={ action('onSend') } onCancel={ action('onCancel')}  />
  ))
