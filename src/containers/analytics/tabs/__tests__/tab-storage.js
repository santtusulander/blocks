import React from 'react'
import { shallow } from 'enzyme'

jest.mock('../../../../util/helpers', () => {
  return {
    buildAnalyticsOpts: val => {
      return {startDate: 1451606400, endDate: 1454284799}
    }
  }
})

jest.mock('../../../../redux/modules/entities/storage-metrics/actions', () => {
  fetchMetrics: jest.fn()
})

const genAsyncMock = () => {return Promise.resolve()}

jest.unmock('../tab-storage.jsx')
import AnalyticsTabStorage from '../tab-storage.jsx'

describe('AnalyticsTabStorage', () => {
  let subject = null

  beforeEach(() => {
    subject = () => {
      let props = {
        getTotals: () => {
          return {
            peak: 0,
            low: 0,
            average: 0
          }
        },
        fetchStorageMetrics: jest.fn(),
        fetchGroups: genAsyncMock
      }
      return shallow(<AnalyticsTabStorage {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
