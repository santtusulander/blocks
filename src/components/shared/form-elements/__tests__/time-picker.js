import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment'

jest.unmock('../time-picker.jsx')
import TimePicker from '../time-picker.jsx'

function intlMaker() {
  return {
    formatTime: jest.fn()
  }
}

describe('TimePicker', () => {
  it('should exist', () => {
    const timePicker = shallow(<TimePicker intl={intlMaker()} time={moment().utc()} />)

    expect(timePicker.find('.time-picker').length).toBe(1)
  });
})
