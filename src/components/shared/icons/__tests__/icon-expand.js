import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-expand')
import IconExpand from '../icon-expand'

const subject = shallow(
  <IconExpand />
)

describe('IconExpand', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
