import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-item-list')
import IconItemList from '../icon-item-list'

const subject = shallow(
  <IconItemList />
)

describe('IconItemList', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
