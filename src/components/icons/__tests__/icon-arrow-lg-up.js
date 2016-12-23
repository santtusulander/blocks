import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-arrow-lg-up')
import IconArrowLgUp from '../icon-arrow-lg-up'

const subject = shallow(
  <IconArrowLgUp />
)

describe('IconArrowLgUp', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
