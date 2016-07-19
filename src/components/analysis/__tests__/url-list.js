import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.dontMock('../url-list.jsx')
const URLList = require('../url-list.jsx')

// Set up mocks to make sure formatting libs are used correctly
const numeral = require('numeral')
const numeralFormatMock = jest.genMockFunction()
numeral.mockReturnValue({format:numeralFormatMock})

const fakeURLs = Immutable.fromJS([
  {
    url: 'www.abc.com',
    bytes: 1000,
    requests: 3000
  },
  {
    url: 'www.def.com',
    bytes: 2000,
    requests: 2000
  },
  {
    url: 'www.ghi.com',
    bytes: 3000,
    requests: 1000
  }
])

describe('URLList', () => {
  it('should exist', () => {
    const renderer = TestUtils.createRenderer()
    renderer.render(<URLList />);
    const result = renderer.getRenderOutput()
    expect(result.type).toEqual('div')
  })
  it('should have a row for each url', () => {
    const renderer = TestUtils.createRenderer()
    renderer.render(
      <URLList
        urls={fakeURLs}
        labelFormat={jest.genMockFunction()}/>
    )
    const result = renderer.getRenderOutput()
    expect(result.props.children[1].props.children[1].props.children.length).toEqual(3)
  })
  it('should use the label formatter', () => {
    const renderer = TestUtils.createRenderer()
    const labelFormatter = jest.genMockFunction()
    renderer.render(
      <URLList
        urls={fakeURLs}
        labelFormat={labelFormatter}/>
    )
    expect(labelFormatter.mock.calls.length).toEqual(3)
    expect(labelFormatter.mock.calls[0][0].toJS()).toEqual(fakeURLs.get(2).toJS())
  })
})
