import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'
import { shallow, mount } from 'enzyme'

// Mock out intl
jest.mock('react-intl')
const reactIntl = require('react-intl')
reactIntl.injectIntl = jest.fn(wrappedClass => wrappedClass)

jest.dontMock('../actions-selection.jsx')
const ActionsSelection = require('../actions-selection.jsx')

describe('ConditionSelection', () => {
  it('should exist', () => {
    const actionsSelection = shallow(<ActionsSelection />)
    expect(actionsSelection).toBeDefined()
  });

  it('should set a set key', () => {
    const changeValue = jest.genMockFunction()
    const activateSet = jest.genMockFunction()
    let actionsSelection = TestUtils.renderIntoDocument(
      <ActionsSelection
        changeValue={changeValue}
        activateSet={activateSet}
        path={[]}
        config={Immutable.Map()} />
    );
    let links = TestUtils.scryRenderedDOMComponentsWithTag(actionsSelection, 'a');
    TestUtils.Simulate.click(links[0])
    expect(changeValue.mock.calls.length).toBe(1)
    expect(activateSet.mock.calls.length).toBe(1)
  });
});
