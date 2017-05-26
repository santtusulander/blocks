import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../tab-file-error')
jest.unmock('../../../../redux/modules/fetching/actions')
import AnalyticsTabFileError from '../tab-file-error'

jest.mock('../../../../util/status-codes', () => {
  return {
    getAnalysisErrorCodes: () => [],
    getAnalysisStatusCodes: () => []
  }
})

describe('AnalyticsTabFileError', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {}
      return shallow(<AnalyticsTabFileError {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
