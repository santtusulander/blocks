import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../tab-on-off-net')
import AnalyticsTabOnOffNet from '../tab-on-off-net'

describe('AnalyticsTabOnOffNet', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {}
      return shallow(<AnalyticsTabOnOffNet {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
