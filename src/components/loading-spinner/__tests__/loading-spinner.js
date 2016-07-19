import React from 'react'
import {shallow} from 'enzyme'

jest.unmock('../loading-spinner.jsx')
import LoadingSpinner from '../loading-spinner.jsx'

describe('LoadingSpinner', () => {
  it('should exist', () => {
    const spinner = shallow(<LoadingSpinner />)

    spinner.find('.loading-spinner')
    expect(spinner.find('.loading-spinner').length).toBe(1)
  })

  it('should have 2 DIVs', () => {
    const spinner = shallow(<LoadingSpinner />)

    expect(spinner.find('div').length).toBe(2)
  })
})
