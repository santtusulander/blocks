import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-caret-down')
import IconCaretDown from '../icon-caret-down'

const subject = shallow(
  <IconCaretDown className="foo" />
)

describe('IconCaretDown', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
