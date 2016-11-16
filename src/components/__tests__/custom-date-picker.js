import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../custom-date-picker.jsx')
import CustomDatePicker from '../custom-date-picker.jsx'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('CustomDatePicker', () => {
  it('should exist', () => {
    const customDatePicker = shallow(<CustomDatePicker intl={intlMaker()} />)
    expect(customDatePicker.find('.custom-date-picker').length).toBe(1)
  });
})
