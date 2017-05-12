import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment'

jest.unmock('../date-range')
import FilterDateRange from '../date-range'

const onFilterChange = jest.fn()

describe('FilterDateRange', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        onFilterChange: jest.fn(),
        showComparison: true
      }
      return shallow(<FilterDateRange {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should limit over 4 month date ranges', () => {
    const component = subject()
    const onFilterChangeMock = jest.fn()
    let props = {
      includeComparison: true,
      startDate: moment(),
      endDate: moment().add(2, 'months'),
      onFilterChange: onFilterChangeMock
    }

    component.setProps(props)
    expect(onFilterChangeMock.mock.calls.length).toEqual(0)

    props.endDate = moment().add(5, 'months')
    component.setProps(props)
    expect(onFilterChangeMock.mock.calls.length).toEqual(1)
  })
})
