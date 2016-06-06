import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {ExportFileForm, EXPORT_TYPE_PDF} from '../export-file-form.jsx'

const ThemeWrap = require('./theme-wrap.jsx');


storiesOf('ExportFileForm', module)
  .addDecorator((story) => (
    <ThemeWrap >
      <div style={{width: '70%', padding: '3%', border: '1px solid #ccc'}}>
        {story()}
      </div>
    </ThemeWrap>
  ))
  .add('ExportFileForm', () => (
      <ExportFileForm fileType={EXPORT_TYPE_PDF} onChange={action('change')} onDownload={action('onDownload')} onCancel={action('onCancel')}  />
  ))
