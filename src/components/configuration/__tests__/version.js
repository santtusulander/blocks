import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../version.jsx')
const ConfigurationVersion = require('../version.jsx')

describe('ConfigurationVersion', () => {
  it('should exist', () => {
    let version = TestUtils.renderIntoDocument(
      <ConfigurationVersion />
    );
    expect(TestUtils.isCompositeComponent(version)).toBeTruthy();
  });

  it('has active class if active', () => {
    let version = TestUtils.renderIntoDocument(
      <ConfigurationVersion active={true}/>
    )
    let link = TestUtils.findRenderedDOMComponentWithClass(version,
      'version-link')
    expect(ReactDOM.findDOMNode(link).className).toContain('active');
  })

  it('should activate a verson when clicked', () => {
    let activate = jest.genMockFunction()
    let version = TestUtils.renderIntoDocument(
      <ConfigurationVersion activate={activate}/>
    )
    let link = TestUtils.findRenderedDOMComponentWithClass(version,
      'version-link')
    TestUtils.Simulate.click(link)
    expect(activate.mock.calls.length).toEqual(1)
  })
})
