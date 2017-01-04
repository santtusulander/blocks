import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../loading-spinner-sm.jsx')
import LoadingSpinnerSmall from '../loading-spinner-sm.jsx'

describe('LoadingSpinnerSmall', () => {
  it('should exist', () => {
    const spinner = shallow(<LoadingSpinnerSmall />)

    expect(spinner.find('.loading-spinner-sm').length).toBe(1)
  })

  it('should have 2 DIVs', () => {
    const spinner = shallow(<LoadingSpinnerSmall />)

    expect(spinner.find('div').length).toBe(2)
  })
})
