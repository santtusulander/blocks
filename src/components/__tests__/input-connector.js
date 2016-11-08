import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

jest.unmock('../input-connector.jsx')
import InputConnector from '../input-connector.jsx'

describe('InputConnector', () => {
  it('should exist', () => {
    let inputConnector = TestUtils.renderIntoDocument(
      <InputConnector/>
    );
    expect(TestUtils.isCompositeComponent(inputConnector)).toBeTruthy();
  });

  it('can be passed a custom css class', () => {
    let inputConnector = TestUtils.renderIntoDocument(
      <InputConnector className="aaa" />
    );
    let container = TestUtils.findRenderedDOMComponentWithTag(inputConnector, 'div');
    expect(ReactDOM.findDOMNode(container).className).toContain('aaa');
  });

  it('can be passed show parameter', () => {
    let inputConnector = TestUtils.renderIntoDocument(
      <InputConnector show={true} />
    );
    let container = TestUtils.findRenderedDOMComponentWithTag(inputConnector, 'div');
    expect(ReactDOM.findDOMNode(container).className).toContain('show');
  });

  it('can be passed has-two-ends parameter', () => {
    let inputConnector = TestUtils.renderIntoDocument(
      <InputConnector hasTwoEnds={true} />
    );
    let container = TestUtils.findRenderedDOMComponentWithTag(inputConnector, 'div');
    expect(ReactDOM.findDOMNode(container).className).toContain('has-two-ends');
  });

  it('can be passed no-label parameter', () => {
    let inputConnector = TestUtils.renderIntoDocument(
      <InputConnector noLabel={true} />
    );
    let container = TestUtils.findRenderedDOMComponentWithTag(inputConnector, 'div');
    expect(ReactDOM.findDOMNode(container).className).toContain('no-label');
  });
})
