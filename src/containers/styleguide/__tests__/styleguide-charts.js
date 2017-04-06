import React from 'react'
import {shallow} from 'enzyme'

jest.unmock('../styleguide-charts')
import StyleguideCharts from '../styleguide-charts'

describe('StyleguideCharts', () => {
  it('should exist', () => {
    let styleguide = shallow(
      <StyleguideCharts />
    );
    expect(styleguide.length).toBe(1);
  });
})
