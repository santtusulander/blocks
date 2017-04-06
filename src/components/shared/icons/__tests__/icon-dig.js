import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-dig')
import IconDig from '../icon-dig'

const subject = shallow(
  <IconDig />
)

describe('IconDig', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
