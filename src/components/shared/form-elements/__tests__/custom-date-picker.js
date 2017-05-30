import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment'

jest.unmock('../custom-date-picker.jsx')
import CustomDatePicker from '../custom-date-picker.jsx'

function intlMaker() {
  return {
    formatDate: jest.fn()
  }
}

describe('CustomDatePicker', () => {
  it('should exist', () => {
    const customDatePicker = shallow(<CustomDatePicker intl={ intlMaker() } startDate={moment()} />)
    expect(customDatePicker.find('.custom-date-picker').length).toBe(1)
  });
})
