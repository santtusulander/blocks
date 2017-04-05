import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../customToggle')
import CustomToggle from '../customToggle'

describe('CustomToggle', () => {
  it('should exist', () => {
    const customToggle = shallow(<CustomToggle />)
    expect(customToggle.length).toBe(1)
  });
})
