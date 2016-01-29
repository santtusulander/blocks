import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

jest.autoMockOff() // Uses react-bootstrap extensively, so don't auto mock

jest.dontMock('../select.jsx')
const Select = require('../select.jsx')

describe('Select', () => {
  it('should exist', () => {
    let select = TestUtils.renderIntoDocument(
      <Select value={'foo'} options={[['foo', 'bar']]} />
    );
    expect(TestUtils.isCompositeComponent(select)).toBeTruthy();
  });

  it('can be passed a custom css class', () => {
    let select = TestUtils.renderIntoDocument(
      <Select className="aaa" value={'foo'} options={[['foo', 'bar']]} />
    );
    let container = TestUtils.findRenderedDOMComponentWithTag(select, 'div');
    expect(ReactDOM.findDOMNode(container).className).toContain('aaa');
  });
})
