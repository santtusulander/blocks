import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.autoMockOff()
jest.dontMock('../actions-selection.jsx')
const ActionsSelection = require('../actions-selection.jsx')

describe('ConditionSelection', () => {
  it('should exist', () => {
    const actionsSelection = shallow(
      <ActionsSelection
        path={Immutable.fromJS(['request_policy'])}
        rule={Immutable.Map()} />
    )
    expect(actionsSelection).toBeDefined()
  });

  it('should set a set key', () => {
    const changeValue = jest.genMockFunction()
    const activateSet = jest.genMockFunction()
    let actionsSelection = TestUtils.renderIntoDocument(
      <ActionsSelection
        changeValue={changeValue}
        activateSet={activateSet}
        path={Immutable.fromJS(['request_policy'])}
        config={Immutable.Map()} />
    );
    let links = TestUtils.scryRenderedDOMComponentsWithTag(actionsSelection, 'a');
    TestUtils.Simulate.click(links[0])
    expect(changeValue.mock.calls.length).toBe(1)
    expect(activateSet.mock.calls.length).toBe(1)
  });
});
