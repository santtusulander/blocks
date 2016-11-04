import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../custom-legend')
import Legend from '../custom-legend'

const subject = shallow(
  <Legend
    data={[
      { dataKey: 'onNetHttp', name: 'On-Net HTTP', className: 'line-0' },
      { dataKey: 'onNetHttps', name: 'On-Net HTTPS', className: 'line-1' },
      { dataKey: 'offNetHttp', name: 'Off-Net HTTP', className: 'line-2' },
      { dataKey: 'offNetHttps', name: 'Off-Net HTTPS', className: 'line-3' }
    ]}/>
)

describe('Custom Legend', () => {
  it('should exist', () => {
    expect(subject).toBeDefined()
  });
  it('should show all items', () => {
    expect(subject.find('#legend-item').length).toBe(4)
  });
})
