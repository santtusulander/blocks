import React from 'react'
import {storiesOf} from '@kadira/storybook'

import FileUploadStatus from '../file-upload-status-container.jsx'
import ThemeWrap from './theme-wrap.jsx'

storiesOf('File Upload Status', module)
  .addDecorator((story) => (
    <ThemeWrap>
      {story()}
    </ThemeWrap>
  ))
  .add('Default', () => (
    <FileUploadStatus />
  ))

