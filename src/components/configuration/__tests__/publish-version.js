import React from 'react'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../publish-version.jsx')
const ConfigurationPublishVersion = require('../publish-version.jsx')

describe('ConfigurationPublishVersion', () => {
  it('should exist', () => {
    let publish = TestUtils.renderIntoDocument(
      <ConfigurationPublishVersion />
    );
    expect(TestUtils.isCompositeComponent(publish)).toBeTruthy();
  });
  it('should save changes', () => {
    let saveChanges = jest.genMockFunction()
    let hideAction = jest.genMockFunction()
    let publish = TestUtils.renderIntoDocument(
      <ConfigurationPublishVersion
        saveChanges={saveChanges}
        hideAction={hideAction}/>
    )
    let btns = TestUtils.scryRenderedDOMComponentsWithTag(publish, 'button')
    TestUtils.Simulate.click(btns[1])
    expect(saveChanges.mock.calls.length).toEqual(1)
  })
})
