import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../tab-url-report')
import AnalyticsTabUrlReport from '../tab-url-report'

jest.mock('../../../../util/status-codes', () => {
  return {
    getAnalysisErrorCodes: () => [],
    getAnalysisStatusCodes: () => []
  }
})

describe('AnalyticsTabUrlReport', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {}
      return shallow(<AnalyticsTabUrlReport {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
