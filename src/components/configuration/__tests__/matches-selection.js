import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { shallow } from 'enzyme'

jest.dontMock('../matches-selection.jsx')
const MatchesSelection = require('../matches-selection.jsx')

describe('ConditionSelection', () => {
  it('should exist', () => {
    const matchesSelection = shallow(<MatchesSelection />)
    expect(matchesSelection).toBeDefined()
  });
});
