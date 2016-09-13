import React from 'react'
import Immutable from 'immutable'
import {shallow} from 'enzyme'

jest.dontMock('../content-item-list.jsx')
const ContentItemList = require('../content-item-list.jsx')

describe('ContentItemList', () => {
  it('should exist', () => {
    const contentItem = shallow(
      <ContentItemList
        account={Immutable.Map()}
        linkTo={'/'}
        analyticsLink={'/'}/>
    );
    expect(contentItem.length).toBe(1)
  })

  it('does not show an config button when it is not supposed to', () => {
    const contentItem = shallow(
      <ContentItemList
        linkTo={'/'}
        analyticsLink={'/'}/>
    );
    const editBtn = contentItem.find('.edit-content-item')
    expect(editBtn.length).toBe(0)
  })

  it('shows a config button when it is supposed to', () => {
    const contentItem = shallow(
      <ContentItemList
        configurationLink={'foo'}
        linkTo={'/'}
        analyticsLink={'/'}/>
    );
    const editBtn = contentItem.find('.edit-content-item')
    expect(editBtn.length).toBe(1)
  })
})
