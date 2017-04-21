import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../filter-dropdown')
import FilterDropdown from '../filter-dropdown'

const options = Immutable.fromJS([
  {
    link: 'foo'
  }
])

describe('FilterDropdown', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        className: 'foo',
        parent: 'bar',
        options,
        intl: {formatMessage:jest.fn()},
      }
      return shallow(<FilterDropdown {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
