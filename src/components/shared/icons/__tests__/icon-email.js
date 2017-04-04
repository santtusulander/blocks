import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-email')
import IconEmail from '../icon-email'

const subject = shallow(
  <IconEmail />
)

describe('IconEmail', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
