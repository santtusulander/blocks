import React from 'react'
import {storiesOf} from '@kadira/storybook'

import FileUploadStatus from '../../storage/file-upload-status-container.jsx'
import ThemeWrap from '../theme-wrap.jsx'

const mockData = [
  {
    name: 'too long name for item being uploaded',
    type: 'directory',
    progress: 75
  },
  {
    name: 'filename.mov',
    type: 'file',
    progress: 33
  }
]

storiesOf('Storage', module)
  .addDecorator((story) => (
    <ThemeWrap>
      {story()}
    </ThemeWrap>
  ))
  .add('File Upload Status Container', () => (
    <FileUploadStatus uploads={mockData}/>
  ))

