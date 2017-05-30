import React from 'react'
import {shallow} from 'enzyme'

jest.unmock('../styleguide.jsx')
jest.unmock('../../../redux/modules/fetching/actions')
jest.unmock('../../../decorators/select-auto-close')

jest.mock('../../../util/helpers', () => { return {
  formatBytes: bytes => bytes,
  separateUnit: bytes => bytes
}})

function intlMaker() {
  return {
    formatDate: jest.fn(),
    formatTime: jest.fn()
  }
}

import Styleguide from '../styleguide.jsx'

describe('Styleguide', () => {
  it('should exist', () => {
    let styleguide = shallow(
      <Styleguide intl={ intlMaker() }/>
    );
    expect(styleguide.length).toBe(1);
  });
})
