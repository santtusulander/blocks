import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../storage.jsx')
import AnalysisStorage from '../storage.jsx'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('AnalysisStorage', () => {
  it('should exist', () => {
    let subject = shallow(
      <AnalysisStorage intl={intlMaker()} />
    );
    expect(subject.length).toBe(1)
  });
});
