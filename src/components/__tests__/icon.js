import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

jest.autoMockOff() // Uses react-bootstrap extensively, so don't auto mock

jest.dontMock('../icon.jsx')
const Icon = require('../icon.jsx')

describe('Icon', () => {
  it('should exist', () => {
    let icon = TestUtils.renderIntoDocument(
      <Icon />
    );
    expect(TestUtils.isCompositeComponent(icon)).toBeTruthy();
  });

  it('can be passed a custom css class', () => {
    let icon = TestUtils.renderIntoDocument(
      <Icon className="foo" />
    );
    let container = TestUtils.findRenderedDOMComponentWithTag(icon, 'svg');
    expect(ReactDOM.findDOMNode(container).className).toContain('foo');
  });

  it('can be passed a width', () => {
    let icon = TestUtils.renderIntoDocument(
      <Icon width="100" />
    );
    let container = TestUtils.findRenderedDOMComponentWithTag(icon, 'svg');
    expect(ReactDOM.findDOMNode(container).getAttribute('width')).toMatch('100');
  });

  it('can be passed a height', () => {
    let icon = TestUtils.renderIntoDocument(
      <Icon height="100" />
    );
    let container = TestUtils.findRenderedDOMComponentWithTag(icon, 'svg');
    expect(ReactDOM.findDOMNode(container).getAttribute('height')).toMatch('100');
  });
})
