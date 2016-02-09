import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'
import { Link } from 'react-router'

jest.autoMockOff()
jest.dontMock('../content-item-list.jsx')
const ContentItemList = require('../content-item-list.jsx')

describe('ContentItemList', () => {
  it('should exist', () => {
    let contentItem = TestUtils.renderIntoDocument(
      <ContentItemList account={Immutable.Map()}>
        <Link to="/"/>
      </ContentItemList>
    );
    expect(TestUtils.isCompositeComponent(contentItem)).toBeTruthy();
  })
})
