import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-user')
import IconUser from '../icon-user'

const subject = shallow(
  <IconUser />
)

describe('IconUser', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
