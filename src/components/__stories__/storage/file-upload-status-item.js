import React from 'react'
import {storiesOf} from '@kadira/storybook'

import FileUploadStatusItem from '../../storage/file-upload-status-item.jsx'
import ThemeWrap from '../theme-wrap.jsx'

storiesOf('File Upload Status', module)
  .addDecorator((story) => (
    <ThemeWrap>
      {story()}
    </ThemeWrap>
  ))
  .add('Item', () => (
    <FileUploadStatusItem
      name='item'
      progress={33}
      type='file'
    />
  ))

