import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../styleguide.jsx')
import Styleguide from '../styleguide.jsx'

describe('Styleguide', () => {
  it('should exist', () => {
    expect(shallow(<Styleguide/>).length).toBe(1)
  });
})
