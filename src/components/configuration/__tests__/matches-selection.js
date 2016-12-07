import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../matches-selection.jsx')
import MatchesSelection from '../matches-selection.jsx'

describe('ConditionSelection', () => {
  it('should exist', () => {
    const matchesSelection = shallow(
      <MatchesSelection
        path={Immutable.fromJS(['request_policy'])}
        rule={Immutable.Map()} />
    )
    expect(matchesSelection).toBeDefined()
  });
});
