import React from 'react'
import { shallow } from 'enzyme'

jest.dontMock('../playback-demo.jsx')
const PlaybackDemo = require('../playback-demo.jsx')

describe('PlaybackDemo', () => {
  it('should exist', () => {
    let demo = shallow(
      <PlaybackDemo />
    );
    expect(demo).toBeTruthy();
  });
})
