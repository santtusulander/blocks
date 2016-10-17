import React from 'react'
import { shallow } from 'enzyme'

jest.autoMockOff()
jest.unmock('../styleguide.jsx')
const Styleguide = require('../styleguide.jsx')

describe('Styleguide', () => {
  it('should exist', () => {
    let styleguide = shallow(
      <Styleguide />
    );
    expect(styleguide.length).toBe(1);
  });
})
