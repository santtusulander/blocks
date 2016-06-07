import React from 'react'
import {shallow} from 'enzyme'

jest.unmock('../legend.jsx')
import Legend from '../legend.jsx'

describe('Legend', () => {
  it('should exist', () => {
    const legend = shallow(
      <Legend
        primaryLabel='testLabel'
        primaryValue='testValue'
        secondaryLabel='testLabel2'
        secondaryValue='testValue2'
      />
    );

    expect(legend.length).toBe(1);
  });

  it('should have label & value', () => {
    const legend = shallow(
      <Legend
        primaryLabel='testLabel'
        primaryValue='testValue'
        secondaryLabel='testLabel2'
        secondaryValue='testValue2'
      />)

    expect(legend.find('.primary .legend-label').text()).toBe( 'testLabel')
    expect(legend.find('.primary .legend-value').text()).toBe( 'testValue')

    expect(legend.find('.secondary .legend-label').text()).toBe( 'testLabel2')
    expect(legend.find('.secondary .legend-value').text()).toBe( 'testValue2')

  });
})
