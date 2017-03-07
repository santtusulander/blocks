import React from 'react'
import { shallow } from 'enzyme'
import '../../../../__mocks__/recharts'

jest.unmock('../stacked-area-chart-tick')
import StackAreaCustomTick from '../stacked-area-chart-tick'

jest.mock('../../../util/helpers', () => ({ formatBitsPerSecond: bits_per_second => bits_per_second }))

const subject = shallow(
  <StackAreaCustomTick
    payload={
      [{
        coordinate : "489",
        isShow : true,
        tickCoord : "489",
        value : "2000000000"
      }]
    }
    x={100}
    y={100}
    />
)

describe('Custom Tick Stack Area Chart', () => {
  it('should exist', () => {
    expect(subject).toBeDefined()
  });
})
