import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

jest.autoMockOff() // Uses react-bootstrap extensively, so don't auto mock

jest.dontMock('../header.jsx')
const Header = require('../header.jsx')

describe('Header', () => {
  it('should exist', () => {
    let header = TestUtils.renderIntoDocument(
      <Header />
    );
    expect(TestUtils.isCompositeComponent(header)).toBeTruthy();
  });

  it('can be passed a custom css class', () => {
    let header = TestUtils.renderIntoDocument(
      <Header className="foo" />
    );
    let container = TestUtils.findRenderedDOMComponentWithTag(header, 'nav');
    expect(ReactDOM.findDOMNode(container).className).toContain('foo');
  });
})
