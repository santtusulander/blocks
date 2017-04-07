import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-arrow-lg-down')
import IconArrowLgDown from '../icon-arrow-lg-down'

const subject = shallow(
  <IconArrowLgDown />
)

describe('IconArrowLgDown', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
