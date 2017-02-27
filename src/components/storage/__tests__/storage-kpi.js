import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../storage-kpi')
import StorageKPI from '../storage-kpi'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

const subject = shallow(
  <StorageKPI
    intl={intlMaker()}
    chartData={[
      {bytes: 45000, timestamp: new Date('Thu May 26 2016 11:17:01 GMT-0700 (PDT)')}
    ]}
    chartDataKey='bytes'
    currentValue={112}
    gainPercentage={0.2}
    locations={['San Jose', 'Frankfurt']}
    peakValue={120}
    referenceValue={100}
    valuesUnit='tb'
  />
)

describe('StorageKPI', () => {
  it('should exist', () => {
    expect(subject.length).toBe(1)
  })
})
