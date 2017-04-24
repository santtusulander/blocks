import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-security')
import IconSecurity from '../icon-security'

const subject = shallow(
  <IconSecurity />
)

describe('IconSecurity', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
