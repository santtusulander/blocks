import React from 'react'
import { Button } from 'react-bootstrap'
import {storiesOf, action} from '@kadira/storybook'

import InfoModal from '../info-modal.jsx'
import ThemeWrap from './theme-wrap.jsx'

storiesOf('Info Modal', module)
  .addDecorator((story) => (
    <ThemeWrap>
      {story()}
    </ThemeWrap>
  ))
  .add('Default', () => (
    <InfoModal
      title={'Warning'}
      content={'You have made changes to the Account and/or Group(s), are you sure you want to exit without saving?'}>
      <Button bsStyle="primary" onClick={action('stay')}>
        Stay
      </Button>
      <Button bsStyle="primary" onClick={action('move on')}>
        Continue
      </Button>
    </InfoModal>
  ))

