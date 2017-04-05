import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-header-caret')
import IconHeaderCaret from '../icon-header-caret'

const subject = shallow(
  <IconHeaderCaret />
)

describe('IconHeaderCaret', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
