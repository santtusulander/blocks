import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.dontMock('../data-box.jsx')
const DataBox = require('../data-box.jsx')

const fakeErrs = [
  {
    code: '400',
    value: Immutable.Map({"http":3,"https":4,"total":7})
  },
  {
    code: '404',
    value: Immutable.Map({"http":1,"https":2,"total":3})
  }
]

describe('DataBox', () => {
  it('should show the label and code', () => {
    const renderer = TestUtils.createRenderer()
    renderer.render(<DataBox label="aaa" code="bbb"/>);
    const result = renderer.getRenderOutput()
    expect(result.props.children[0].props.children).toEqual('aaa');
    expect(result.props.children[1].props.children).toEqual('bbb');
  });
  it('should show the summaries', () => {
    const renderer = TestUtils.createRenderer()
    renderer.render(<DataBox errs={fakeErrs}/>);
    const result = renderer.getRenderOutput()
    expect(result.props.children[2].props.children.length).toEqual(2);
  });
})
