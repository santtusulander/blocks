import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-select-caret')
import IconSelectCaret from '../icon-select-caret'

const subject = shallow(
  <IconSelectCaret />
)

describe('IconSelectCaret', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
