import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../property.jsx')
import Property from '../property.jsx'

describe('FilterProperty', () => {
  it('should exist', () => {
    expect(shallow(<Property/>)).toBeTruthy()
  })
})
