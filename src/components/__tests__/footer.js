import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../footer.jsx')
const Footer = require('../footer.jsx')

describe('Footer', () => {
  it('should exist', () => {
    let footer = TestUtils.renderIntoDocument(
      <Footer />
    );
    expect(TestUtils.isCompositeComponent(footer)).toBeTruthy();
  });

  it('can be passed a custom css class', () => {
    let footer = TestUtils.renderIntoDocument(
      <Footer className="foo" />
    );
    let container = TestUtils.findRenderedDOMComponentWithTag(footer, 'div');
    expect(ReactDOM.findDOMNode(container).className).toContain('foo');
  });
})
