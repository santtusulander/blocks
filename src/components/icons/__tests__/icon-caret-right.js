import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-caret-right')
import IconCaretRight from '../icon-caret-right'

const subject = shallow(
  <IconCaretRight className="foo" />
)

describe('IconCaretRight', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
