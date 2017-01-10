import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../tab-visitors')
import AnalyticsTabVisitors from '../tab-visitors'

describe('AnalyticsTabVisitors', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {}
      return shallow(<AnalyticsTabVisitors {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
