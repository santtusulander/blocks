import React from 'react'
import {shallow} from 'enzyme'

jest.unmock('../styleguide.jsx')
jest.unmock('../../decorators/select-auto-close')

jest.mock('../../util/helpers', () => { return {
  formatBytes: bytes => bytes,
  separateUnit: bytes => bytes
}})

import Styleguide from '../styleguide.jsx'

describe('Styleguide', () => {
  it('should exist', () => {
    let styleguide = shallow(
      <Styleguide />
    );
    expect(styleguide.length).toBe(1);
  });
})
