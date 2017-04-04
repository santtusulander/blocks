import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-arrow-lg-right')
import IconArrowLgRight from '../icon-arrow-lg-right'

const subject = shallow(
  <IconArrowLgRight />
)

describe('IconArrowLgRight', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
