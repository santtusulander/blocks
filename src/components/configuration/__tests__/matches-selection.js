import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../matches-selection.jsx')
import MatchesSelection from '../matches-selection.jsx'

describe('ConditionSelection', () => {
  it('should exist', () => {
    const matchesSelection = shallow(<MatchesSelection />)
    expect(matchesSelection).toBeDefined()
  });
});
