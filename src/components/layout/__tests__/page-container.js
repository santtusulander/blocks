import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

jest.unmock('../page-container.jsx')
import PageContainer from '../page-container.jsx'

describe('Page Container layout', () => {
  it('should exist', () => {
    let layout = TestUtils.renderIntoDocument(
      <PageContainer />
    );
    expect(TestUtils.isCompositeComponent(layout)).toBeTruthy();
  });

  it('can be passed a custom css class', () => {
    let layout = TestUtils.renderIntoDocument(
      <PageContainer className="aaa" />
    );

    // Verify that it has the passed class
    let container = TestUtils.findRenderedDOMComponentWithTag(
      layout, 'div');
    expect(ReactDOM.findDOMNode(container).className)
      .toContain('aaa');
  });

  it('renders a child', () => {
    let layout = TestUtils.renderIntoDocument(
      <PageContainer>
        <span className="test">Test</span>
      </PageContainer>
    );

    // Verify that it has the child element
    let child = TestUtils.findRenderedDOMComponentWithClass(
      layout, 'test');
    expect(ReactDOM.findDOMNode(child).textContent)
      .toEqual('Test');
  });
})
