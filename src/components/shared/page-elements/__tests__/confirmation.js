import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

jest.unmock('../confirmation.jsx')
import Confirmation from '../confirmation.jsx'

describe('Confirmation', () => {
  it('should exist', () => {
    let confirmation = TestUtils.renderIntoDocument(
      <Confirmation />
    );
    expect(TestUtils.isCompositeComponent(confirmation)).toBeTruthy();
  });

  it('can be passed a custom css class', () => {
    let confirmation = TestUtils.renderIntoDocument(
      <Confirmation className="foo" />
    );
    let container = TestUtils.findRenderedDOMComponentWithClass(confirmation, 'confirmation-slider');
    expect(ReactDOM.findDOMNode(container).className).toContain('foo');
  });
})
