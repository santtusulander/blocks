import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-calendar')
import IconCalendar from '../icon-calendar'

const subject = shallow(
  <IconCalendar />
)

describe('IconCalendar', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
