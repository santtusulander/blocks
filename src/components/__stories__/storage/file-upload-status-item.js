import React from 'react'
import {storiesOf} from '@kadira/storybook'

import FileUploadStatusItem from '../../storage/file-upload-status-item.jsx'
import ThemeWrap from '../theme-wrap.jsx'

storiesOf('Storage', module)
  .addDecorator((story) => (
    <ThemeWrap>
      {story()}
    </ThemeWrap>
  ))
  .add('File Upload Status Item', () => (
    <FileUploadStatusItem
      name='item'
      progress={33}
      type='file'
    />
  ))

