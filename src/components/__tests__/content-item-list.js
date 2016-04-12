import React from 'react'
import Immutable from 'immutable'
import TestUtils from 'react-addons-test-utils'

jest.dontMock('../content-item-list.jsx')
const ContentItemList = require('../content-item-list.jsx')

describe('ContentItemList', () => {
  it('should exist', () => {
    let contentItem = TestUtils.renderIntoDocument(
      <ContentItemList
        account={Immutable.Map()}
        linkTo={'/'}
        analyticsLink={'/'}/>
    );
    expect(TestUtils.isCompositeComponent(contentItem)).toBeTruthy();
  });

  it('does not show an config button when it is not supposed to', () => {
    let contentItem = TestUtils.renderIntoDocument(
      <ContentItemList
        linkTo={'/'}
        analyticsLink={'/'}/>
    );
    let editBtn = TestUtils.scryRenderedDOMComponentsWithClass(contentItem, 'edit-content-item');
    expect(editBtn.length).toBe(0)
  });

  it('shows an config button when it is supposed to', () => {
    let contentItem = TestUtils.renderIntoDocument(
      <ContentItemList
        configurationLink={'foo'}
        linkTo={'/'}
        analyticsLink={'/'} />
    );
    let editBtn = TestUtils.scryRenderedDOMComponentsWithClass(contentItem, 'edit-content-item');
    expect(editBtn.length).toBe(1)
  });
})
