import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment-timezone'

jest.unmock('../custom-date-picker.jsx')
import CustomDatePicker from '../custom-date-picker.jsx'

describe('CustomDatePicker', () => {
  it('should exist', () => {
    const customDatePicker = shallow(<CustomDatePicker startDate={moment()} />)
    expect(customDatePicker.find('.custom-date-picker').length).toBe(1)
  });
})
