import React from 'react'
import {shallow} from 'enzyme'

jest.unmock('../styleguide-icons')
import StyleguideIcons from '../styleguide-icons'

describe('StyleguideIcons', () => {
  it('should exist', () => {
    let styleguide = shallow(
      <StyleguideIcons />
    );
    expect(styleguide.length).toBe(1);
  });
})
