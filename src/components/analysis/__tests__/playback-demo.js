import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../playback-demo.jsx')
import PlaybackDemo from '../playback-demo.jsx'

describe('PlaybackDemo', () => {
  let subject = null
  let props = {}
  beforeEach(() => {
    subject = () => {
      props = {
        activeVideo: 'test'
      }
      return shallow(<PlaybackDemo {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject()).toBeTruthy();
  })

  it('should render AnalysisByKey', () => {
    expect(subject().find('AnalysisByKey').length).toBeTruthy();
  })

  it('should render video player', () => {
    expect(subject().find('video').length).toBeTruthy();
  })

})
