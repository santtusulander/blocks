import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-chart')
import IconChart from '../icon-chart'

const subject = shallow(
  <IconChart />
)

describe('IconChart', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
