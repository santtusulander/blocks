import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../line-area-composed-chart-tooltip')
import LineAreaComposedChartTooltip from '../line-area-composed-chart-tooltip'

jest.mock('../../../util/helpers', () => ({ formatBytes: bytes => bytes, formatUnixTimestamp: unix => unix }))

const subject = shallow(
  <LineAreaComposedChartTooltip
    iconClassNamePicker={jest.fn()}
    payload={[
      { name: 'aa', value: 1000, timestamp: 1484139959 },
      { name: 'bb', value: 1000, timestamp: 1484139959 }
    ]}/>
)

describe('LineAreaComposedChartTooltip', () => {
  it('should exist', () => {
    expect(subject).toBeDefined()
  });
})
