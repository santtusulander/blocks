import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../tab-traffic')
import AnalyticsTabTraffic from '../tab-traffic'

describe('AnalyticsTabTraffic', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {}
      return shallow(<AnalyticsTabTraffic {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
