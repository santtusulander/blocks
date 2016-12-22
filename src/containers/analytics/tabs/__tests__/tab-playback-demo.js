import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../tab-playback-demo')
import AnalyticsTabPlaybackDemo from '../tab-playback-demo'

describe('AnalyticsTabPlaybackDemo', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {}
      return shallow(<AnalyticsTabPlaybackDemo {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
