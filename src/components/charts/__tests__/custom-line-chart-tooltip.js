import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../custom-line-chart-tooltip')
import Tooltip from '../custom-line-chart-tooltip'

jest.mock('../../../util/helpers', () => ({ formatBytes: bytes => bytes }))

const subject = shallow(
  <Tooltip
    iconClass={dataKey => dataKey}
    payload={[
      { name: 'aa', value: 1000, dataKey: 1 },
      { name: 'bb', value: 1000, dataKey: 2 }
    ]}/>
)

describe('Custom Line Chart Tooltip', () => {
  it('should exist', () => {
    expect(subject).toBeDefined()
  });
})
