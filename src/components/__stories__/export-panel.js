import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

const ThemeWrap = require('./theme-wrap.jsx');

import { ExportPanel } from '../export-panel.jsx'

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
      onSend={action('onSend')}
      onCancel={action('onCancel')}
      panelTitle={'Export panel dark'}
    />
  ))
  .add('Email (dark)', () => (
    <ExportPanel
      show={true}
      exportType={'export_email'}
      onSend={action('onSend')}
      onCancel={action('onCancel')}
      showExportPanel={true}
      panelTitle={'Export panel dark'}
    />
  ))
