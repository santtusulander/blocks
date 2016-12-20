import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-arrow-down')
import IconArrowDown from '../icon-arrow-down'

const subject = shallow(
  <IconArrowDown />
)

describe('IconArrowDown', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
