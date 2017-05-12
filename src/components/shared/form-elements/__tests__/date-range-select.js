import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../date-range-select.jsx')
import DateRange from '../date-range-select.jsx'
import moment from 'moment'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('DateRangeSelect', () => {
  it('should exist', () => {
    const filter = shallow(
      <DateRange
        startDate={moment()}
        endDate={moment()}
        availableRanges={[1]}
        changeDateRange={jest.fn()}
        intl={intlMaker()} />
    )
    expect(filter).toBeDefined()
  })
})
