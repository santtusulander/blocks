import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../tab-cache-hit-rate')
import AnalyticsTabCacheHitRate from '../tab-cache-hit-rate'

describe('AnalyticsTabCacheHitRate', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {}
      return shallow(<AnalyticsTabCacheHitRate {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
