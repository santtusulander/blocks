import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../month-picker.jsx')
import MonthPicker from '../month-picker.jsx'
import moment from 'moment'

describe('MonthPicker', () => {
  it('should exist', () => {
    const monthPicker = shallow(
      <MonthPicker date={null} />
    )
    expect(monthPicker).toBeDefined()
  })
})
