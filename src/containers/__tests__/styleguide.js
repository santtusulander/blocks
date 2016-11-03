import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../styleguide.jsx')

jest.mock('../../util/helpers', () => { return {
  formatBytes: bytes => bytes,
  separateUnit: bytes => bytes
}})

import Styleguide from '../styleguide.jsx'

describe('Styleguide', () => {
  it('should exist', () => {
    expect(shallow(<Styleguide/>).length).toBe(1)
  });
})
