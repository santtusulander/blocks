import React from 'react';
import {storiesOf, action} from '@kadira/storybook';

import ThemeWrap from '../theme-wrap'
import MapPoc from '../../map/poc'

import '../../../../node_modules/leaflet/dist/leaflet.css'
import '../../map/poc.scss';

storiesOf('Map', module)
  .addDecorator((story) => (
    <ThemeWrap >
      {story()}
    </ThemeWrap>
  ))
  .add('Poc', () => (
    <div>
      <MapPoc />
    </div>
  ))
