import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.dontMock('../versions.jsx')
const ConfigurationVersions = require('../versions.jsx')

const fakeConfigs = Immutable.fromJS([

])

describe('ConfigurationVersions', () => {
  it('should exist', () => {
    let versions = TestUtils.renderIntoDocument(
      <ConfigurationVersions />
    );
    expect(TestUtils.isCompositeComponent(versions)).toBeTruthy();
  });

  it('should activate a verson', () => {
    let activate = jest.genMockFunction()
    let versions = TestUtils.renderIntoDocument(
      <ConfigurationVersions configurations={fakeConfigs} activate={activate}/>
    )
    let links = TestUtils.scryRenderedDOMComponentsWithClass(versions,
      'version-link')
    TestUtils.Simulate.click(links[0])
    expect(activate.mock.calls.length).toEqual(1)
  })
})
