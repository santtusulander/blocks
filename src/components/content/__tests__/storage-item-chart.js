import React from 'react'
import { shallow } from 'enzyme'
import '../../../../__mocks__/recharts'

jest.unmock('../storage-item-chart')
import StorageItemChart from '../storage-item-chart'

const subject = shallow(
  <StorageItemChart />
)

describe('StorageItemChart', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
