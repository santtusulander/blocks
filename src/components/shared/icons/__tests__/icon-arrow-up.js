import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-arrow-up')
import IconArrowUp from '../icon-arrow-up'

const subject = shallow(
  <IconArrowUp />
)

describe('IconArrowUp', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
