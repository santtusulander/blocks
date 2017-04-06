import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment'

jest.unmock('../time-picker.jsx')
import TimePicker from '../time-picker.jsx'

describe('TimePicker', () => {
  it('should exist', () => {
    const timePicker = shallow(<TimePicker time={moment().utc()} />)

    expect(timePicker.find('.time-picker').length).toBe(1)
  });
})
