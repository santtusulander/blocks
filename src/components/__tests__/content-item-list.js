import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../content-item-list.jsx')
const ContentItemList = require('../content-item-list.jsx')

describe('ContentItemList', () => {
  it('should exist', () => {
    let contentItem = TestUtils.renderIntoDocument(
      <ContentItemList account={Immutable.Map()}/>
    );
    expect(TestUtils.isCompositeComponent(contentItem)).toBeTruthy();
  })
  it('should delete', () => {
    let deleteFunc = jest.genMockFunction()
    let deleteItem = TestUtils.renderIntoDocument(
      <ContentItemList account={Immutable.Map()} delete={deleteFunc}/>
    )
    let links = deleteItem.getElementsByTagName('a')
    TestUtils.Simulate.click(links[0])
    expect(deleteFunc.mock.calls.length).toEqual(1)
  })
  it('should toggle active', () => {
    let toggleActive = jest.genMockFunction()
    let contentItem = TestUtils.renderIntoDocument(
      <ContentItemList account={Immutable.Map()} toggleActive={toggleActive}/>
    )
    let tr = contentItem.getElementsByTagName('div')
    TestUtils.Simulate.click(tr[0])
    expect(toggleActive.mock.calls.length).toEqual(1)
  })
})
