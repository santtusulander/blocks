import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-item-chart')
import IconItemChart from '../icon-item-chart'

const subject = shallow(
  <IconItemChart />
)

describe('IconItemChart', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
