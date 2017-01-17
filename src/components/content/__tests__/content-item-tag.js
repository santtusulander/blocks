import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../content-item-tag')
import ContentItemTag from '../content-item-tag'

const subject = shallow(
  <ContentItemTag />
)

describe('ContentItemTag', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
