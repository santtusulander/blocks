import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

jest.autoMockOff() // Uses react-bootstrap extensively, so don't auto mock

jest.unmock('../dialog.jsx')
import Dialog from '../dialog.jsx'

describe('Select', () => {
  it('should exist', () => {
    let dialog = TestUtils.renderIntoDocument(
      <Dialog />
    );
    expect(TestUtils.isCompositeComponent(dialog)).toBeTruthy();
  });

  it('can be passed a custom css class', () => {
    let dialog = TestUtils.renderIntoDocument(
      <Dialog className="aaa" />
    );
    let container = TestUtils.findRenderedDOMComponentWithClass(dialog, 'configuration-dialog');
    expect(ReactDOM.findDOMNode(container).className).toContain('aaa');
  });
})
