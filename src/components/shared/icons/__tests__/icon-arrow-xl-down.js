import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-arrow-xl-down')
import IconArrowXlDown from '../icon-arrow-xl-down'

const subject = shallow(
  <IconArrowXlDown />
)

describe('IconArrowXlDown', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
