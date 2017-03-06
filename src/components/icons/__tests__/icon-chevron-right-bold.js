import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-chevron-right-bold')
import IconChevronRightBold from '../icon-chevron-right-bold'

const subject = shallow(
  <IconChevronRightBold />
)

describe('IconChevronRightBold', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
