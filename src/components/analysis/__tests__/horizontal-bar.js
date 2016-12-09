import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../horizontal-bar.jsx')
import AnalysisHorizontalBar from '../horizontal-bar.jsx'

describe('AnalysisHorizontalBar', () => {
  it('should exist', () => {
    let chart = shallow(
      <AnalysisHorizontalBar fetching={true}/>
    );
    expect(chart).toBeTruthy();
  });
})
