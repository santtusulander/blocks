import React from 'react'
import { List } from 'immutable'
import { shallow } from 'enzyme'
import '../../../../__mocks__/recharts'

jest.mock('../../../util/helpers', () => { return {
  formatBytes: bytes => bytes,
  separateUnit: bytes => bytes
}})

jest.unmock('../storage-item-chart')
import StorageItemChart from '../storage-item-chart'

const subject = shallow(
  <StorageItemChart
    analyticsLink='#'
    configurationLink='#'
    name="Storage 02"
    locations={List(["Hong Kong"])}
    currentUsage = {80.2e12}
    estimate = {250e12}
    peak = {160e12}
    lastMonthUsage = {100e12}
    lastMonthEstimate = {210e12}
    lastMonthPeak = {160e12} />
)

describe('StorageItemChart', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
