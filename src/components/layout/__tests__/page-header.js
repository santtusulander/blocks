import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../page-header.jsx')
const PageHeader = require('../page-header.jsx')

describe('Page Header layout', () => {
  it('should exist', () => {
    let layout = TestUtils.renderIntoDocument(
      <PageHeader />
    );
    expect(TestUtils.isCompositeComponent(layout)).toBeTruthy();
  });

  it('can be passed a custom css class', () => {
    let layout = TestUtils.renderIntoDocument(
      <PageHeader className="aaa" />
    );

    // Verify that it has the passed class
    let container = TestUtils.findRenderedDOMComponentWithTag(
      layout, 'div');
    expect(React.findDOMNode(container).className)
      .toContain('aaa');
  });

  it('renders a child', () => {
    let layout = TestUtils.renderIntoDocument(
      <PageHeader>
        <span className="test">Test</span>
      </PageHeader>
    );

    // Verify that it has the child element
    let child = TestUtils.findRenderedDOMComponentWithClass(
      layout, 'test');
    expect(React.findDOMNode(child).textContent)
      .toEqual('Test');
  });
})
