import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../storage.jsx')
import AnalysisStorage from '../storage.jsx'

describe('AnalysisStorage', () => {
  it('should exist', () => {
    let subject = shallow(
      <AnalysisStorage />
    );
    expect(subject.length).toBe(1)
  });
});
