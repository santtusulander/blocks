import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.dontMock('../versions.jsx')
const ConfigurationVersions = require('../versions.jsx')
const ConfigurationVersion = require('../version.jsx')

const fakeConfigs = Immutable.fromJS([
  {config_id: 1, configuration_status: {environment: 'staging'}},
  {config_id: 2, configuration_status: {environment: 'production'}},
  {config_id: 3, configuration_status: {}}
])

describe('ConfigurationVersions', () => {
  it('should exist', () => {
    let versions = TestUtils.renderIntoDocument(
      <ConfigurationVersions fetching={true} />
    );
    expect(TestUtils.isCompositeComponent(versions)).toBeTruthy();
  });

  it('should activate a verson', () => {
    let activate = jest.genMockFunction()
    let versions = TestUtils.renderIntoDocument(
      <ConfigurationVersions configurations={fakeConfigs} activate={activate}/>
    )
    versions.activate(1)()
    expect(activate.mock.calls[0][0]).toEqual(1)
  })

  it('should display configurations', () => {
    let versions = TestUtils.renderIntoDocument(
      <ConfigurationVersions configurations={fakeConfigs}/>
    )
    let versionComponents = TestUtils.scryRenderedComponentsWithType(versions,
      ConfigurationVersion)
    expect(versionComponents.length).toBe(3)
  })

  it('should add a verson', () => {
    let addVersion = jest.genMockFunction()
    let versions = TestUtils.renderIntoDocument(
      <ConfigurationVersions configurations={fakeConfigs} addVersion={addVersion}/>
    )
    let button = TestUtils.findRenderedDOMComponentWithClass(versions, 'add-btn');
    TestUtils.Simulate.click(button);
    expect(addVersion.mock.calls.length).toEqual(1)
  })
})
