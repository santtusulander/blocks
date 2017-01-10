import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../tab-traffic')
import AnalyticsTabTraffic from '../tab-traffic'

function trafficActionsMaker() {
  return {
    resetCityData: jest.fn()
  }
}

describe('AnalyticsTabTraffic', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        trafficActions: trafficActionsMaker()
      }
      return shallow(<AnalyticsTabTraffic {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
