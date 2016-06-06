import React from 'react';
import {storiesOf, action} from '@kadira/storybook';

const ThemeWrap = require('./theme-wrap.jsx');
//const ExportPanel = require('../export-panel.jsx');

import {ExportPanel} from '../export-panel.jsx'

storiesOf('ExportPanel', module)
  .addDecorator((story) => (
    <ThemeWrap >
      {story()}
    </ThemeWrap>
  ))
  .add('Download (dark)', () => (
      <ExportPanel
          show={true}
          exportType={'export_pdf'}
          onDownload={action('onDownload')}
          onCancel={action('onCancel')}
          onSend={action('onSend')}
      />
  ))
  .add('Email (dark)', () => (
      <ExportPanel
          show={true}
          exportType={'export_email'}
          onDownload={action('onDownload')}
          onCancel={action('onCancel')}
          onSend={action('onSend')}
      />
  ))
