import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../tab-storage.jsx')
import AnalyticsTabStorage from '../tab-storage.jsx'

describe('AnalyticsTabStorage', () => {
  it('should exist', () => {
    let subject = shallow(
      <AnalyticsTabStorage />
    );
    expect(subject.length).toBe(1)
  });
});
