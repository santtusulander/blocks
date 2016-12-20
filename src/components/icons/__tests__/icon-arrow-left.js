import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-arrow-left')
import IconArrowLeft from '../icon-arrow-left'

const subject = shallow(
  <IconArrowLeft />
)

describe('IconArrowLeft', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
