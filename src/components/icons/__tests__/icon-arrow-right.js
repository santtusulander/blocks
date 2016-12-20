import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-arrow-right')
import IconArrowRight from '../icon-arrow-right'

const subject = shallow(
  <IconArrowRight />
)

describe('IconArrowRight', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
