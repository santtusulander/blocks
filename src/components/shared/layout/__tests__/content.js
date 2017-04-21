import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

jest.unmock('../content.jsx')
import Content from '../content.jsx'

describe('Content layout', () => {
  it('should exist', () => {
    let layout = TestUtils.renderIntoDocument(
      <Content />
    );
    expect(TestUtils.isCompositeComponent(layout)).toBeTruthy();
  });

  it('can be passed a custom css class', () => {
    let layout = TestUtils.renderIntoDocument(
      <Content className="aaa" />
    );

    // Verify that it has the passed class
    let container = TestUtils.findRenderedDOMComponentWithTag(
      layout, 'div');
    expect(ReactDOM.findDOMNode(container).className)
      .toContain('aaa');
  });

  it('renders a child', () => {
    let layout = TestUtils.renderIntoDocument(
      <Content>
        <span className="test">Test</span>
      </Content>
    );

    // Verify that it has the child element
    let child = TestUtils.findRenderedDOMComponentWithClass(
      layout, 'test');
    expect(ReactDOM.findDOMNode(child).textContent)
      .toEqual('Test');
  });
})
