import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../tab-contribution')
import AnalyticsTabContribution from '../tab-contribution'

jest.mock('../../../../util/status-codes', () => {
  return {
    getAnalysisErrorCodes: () => [],
    getAnalysisStatusCodes: () => []
  }
})

describe('AnalyticsTabContribution', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {}
      return shallow(<AnalyticsTabContribution {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
