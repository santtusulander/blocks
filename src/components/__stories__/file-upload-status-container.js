import React from 'react'
import {storiesOf} from '@kadira/storybook'

import FileUploadStatus from '../file-upload-status-container.jsx'
import ThemeWrap from './theme-wrap.jsx'

const mockData = [
  {
    name: 'item with a very long name',
    type: 'file',
    progress: 75
  },
  {
    name: 'item #2',
    type: 'file',
    progress: 33
  }
]

storiesOf('File Upload Status', module)
  .addDecorator((story) => (
    <ThemeWrap>
      {story()}
    </ThemeWrap>
  ))
  .add('Container', () => (
    <FileUploadStatus uploads={mockData}/>
  ))

