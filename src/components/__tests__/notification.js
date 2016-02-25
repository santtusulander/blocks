import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../notification.jsx')
const Notification = require('../notification.jsx')

describe('Notification', () => {
  it('should exist', () => {
    let notification = TestUtils.renderIntoDocument(
      <Notification />
    );
    expect(TestUtils.isCompositeComponent(notification)).toBeTruthy();
  });

  it('can be passed a custom css class', () => {
    let notification = TestUtils.renderIntoDocument(
      <Notification className="foo" />
    );
    let container = TestUtils.findRenderedDOMComponentWithTag(notification, 'div');
    expect(ReactDOM.findDOMNode(container).className).toContain('foo');
  });
})
