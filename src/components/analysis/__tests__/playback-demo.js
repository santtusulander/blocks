import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../playback-demo.jsx')
import PlaybackDemo from '../playback-demo.jsx'

describe('PlaybackDemo', () => {
  it('should exist', () => {
    let demo = shallow(
      <PlaybackDemo />
    );
    expect(demo).toBeTruthy();
  });
})
