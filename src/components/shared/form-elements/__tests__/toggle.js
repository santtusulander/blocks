import React from 'react';
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

jest.unmock('../toggle.jsx');
import Toggle from '../toggle.jsx'

describe('Toggle', function() {

  it('does not have an on class when value is false', () => {
    let toggle = TestUtils.renderIntoDocument(
      <Toggle value={false} />
    );

    // Verify that it has the hidden class
    let container = TestUtils.scryRenderedDOMComponentsWithTag(
      toggle, 'div')[0];
    expect(ReactDOM.findDOMNode(container).className)
      .not.toContain('on');
  });

  it('has an on class when value is true', () => {
    let toggle = TestUtils.renderIntoDocument(
      <Toggle value={true} />
    );

    // Verify that it does not have the hidden class
    let container = TestUtils.scryRenderedDOMComponentsWithTag(
      toggle, 'div')[0];
    expect(ReactDOM.findDOMNode(container).className)
      .toContain('on');
  });

  it('triggers changeValue with opposite value when clicked', () => {
    const changeValue = jest.genMockFunction()
    let toggle = TestUtils.renderIntoDocument(
      <Toggle value={false} changeValue={changeValue} />
    );

    let container = TestUtils.scryRenderedDOMComponentsWithTag(
      toggle, 'div')[0];
    TestUtils.Simulate.click(container)
    expect(changeValue.mock.calls[0][0]).toEqual(true)
  });
});
