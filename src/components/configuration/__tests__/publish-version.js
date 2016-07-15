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

  it('should not save changes if no publish target is defined', () => {
    let saveChanges = jest.genMockFunction()
    let publish = TestUtils.renderIntoDocument(
      <ConfigurationPublishVersion
        saveChanges={saveChanges}/>
    )
    let btns = TestUtils.scryRenderedDOMComponentsWithTag(publish, 'button')
    TestUtils.Simulate.click(btns[1])
    expect(saveChanges.mock.calls.length).toEqual(0)
  })

  it('should save changes if publish target is defined', () => {
    let saveChanges = jest.genMockFunction()
    let publish = TestUtils.renderIntoDocument(
      <ConfigurationPublishVersion
        saveChanges={saveChanges}/>
    )
    publish.setPublishTarget('2')()
    let btns = TestUtils.scryRenderedDOMComponentsWithTag(publish, 'button')
    TestUtils.Simulate.click(btns[1])
    expect(saveChanges.mock.calls.length).toEqual(1)
  })
})
