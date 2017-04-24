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
    <StorageKPI
      chartData={[
        {bytes: 45000, timestamp: new Date('Thu May 26 2016 11:17:01 GMT-0700 (PDT)')},
        {bytes: 65000, timestamp: new Date('Thu May 26 2016 12:17:01 GMT-0700 (PDT)')},
        {bytes: 45000, timestamp: new Date('Thu May 26 2016 13:17:01 GMT-0700 (PDT)')},
        {bytes: 105000, timestamp: new Date('Thu May 26 2016 14:17:01 GMT-0700 (PDT)')},
        {bytes: 115000, timestamp: new Date('Thu May 26 2016 15:17:01 GMT-0700 (PDT)')},
        {bytes: 190000, timestamp: new Date('Thu May 26 2016 16:17:01 GMT-0700 (PDT)')},
        {bytes: 125000, timestamp: new Date('Thu May 26 2016 17:17:01 GMT-0700 (PDT)')},
        {bytes: 155000, timestamp: new Date('Thu May 26 2016 18:17:01 GMT-0700 (PDT)')}
      ]}
      chartDataKey='bytes'
      currentValue={112}
      gainPercentage={0.2}
      locations={['San Jose', 'Frankfurt']}
      peakValue={120}
      referenceValue={100}
      valuesUnit='tb'
    />
  ))
