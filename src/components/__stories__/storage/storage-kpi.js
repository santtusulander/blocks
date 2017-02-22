import React from 'react'
import { storiesOf } from '@kadira/storybook'

import ThemeWrap from '../theme-wrap'
import StorageKPI from '../../storage/storage-kpi'

storiesOf('Storage', module)
  .addDecorator((story) => (
    <ThemeWrap >
      {story()}
    </ThemeWrap>
  ))
  .add('KPI', () => (
    <StorageKPI />
  ))
