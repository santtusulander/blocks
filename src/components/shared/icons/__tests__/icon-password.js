import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-password')
import IconPassword from '../icon-password'

const subject = shallow(
  <IconPassword />
)

describe('IconPassword', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
