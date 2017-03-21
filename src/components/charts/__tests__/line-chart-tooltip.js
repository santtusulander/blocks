import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../line-chart-tooltip')
import Tooltip from '../line-chart-tooltip'

jest.mock('../../../util/helpers', () => ({ formatBytes: bytes => bytes, formatUnixTimestamp: unix => unix }))

const subject = shallow(
  <Tooltip
    iconClassNamePicker={jest.fn()}
    payload={[
      { name: 'aa', value: 1000, timestamp: 1484139959 },
      { name: 'bb', value: 1000, timestamp: 1484139959 }
    ]}/>
)

describe('Custom Line Chart Tooltip', () => {
  it('should exist', () => {
    expect(subject).toBeDefined()
  });
})
