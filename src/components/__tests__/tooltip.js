import React from 'react/addons';

let TestUtils = React.addons.TestUtils;

jest.dontMock('../tooltip.jsx');
const Tooltip = require('../tooltip.jsx');

describe('Tooltip', function() {
  it('uses the x / y coordinates', () => {
    let tooltip = TestUtils.renderIntoDocument(
      <Tooltip x={100} y={200} />
    );

    // Verify that it uses the coordinates
    let container = TestUtils.findRenderedDOMComponentWithTag(
      tooltip, 'div');
    expect(React.findDOMNode(container).style.top)
      .toEqual('200px');
    expect(React.findDOMNode(container).style.left)
      .toEqual('100px');
  });

  it('can be hidden', () => {
    let tooltip = TestUtils.renderIntoDocument(
      <Tooltip hidden={true} />
    );

    // Verify that it has the hidden class
    let container = TestUtils.findRenderedDOMComponentWithTag(
      tooltip, 'div');
    expect(React.findDOMNode(container).className)
      .toContain('hidden');
  });

  it('can be shown', () => {
    let tooltip = TestUtils.renderIntoDocument(
      <Tooltip hidden={false} />
    );

    // Verify that it does not have the hidden class
    let container = TestUtils.findRenderedDOMComponentWithTag(
      tooltip, 'div');
    expect(React.findDOMNode(container).className)
      .not.toContain('hidden');
  });

  it('can be passed a custom css class', () => {
    let tooltip = TestUtils.renderIntoDocument(
      <Tooltip className="aaa" />
    );

    // Verify that it has the passed class
    let container = TestUtils.findRenderedDOMComponentWithTag(
      tooltip, 'div');
    expect(React.findDOMNode(container).className)
      .toContain('aaa');
  });

  it('renders a child', () => {
    let tooltip = TestUtils.renderIntoDocument(
      <Tooltip>
        <span className="test">Test</span>
      </Tooltip>
    );

    // Verify that it has the child element
    let child = TestUtils.findRenderedDOMComponentWithClass(
      tooltip, 'test');
    expect(React.findDOMNode(child).textContent)
      .toEqual('Test');
  });
});
