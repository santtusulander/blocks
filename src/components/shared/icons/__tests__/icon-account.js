import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-account')
import IconAccount from '../icon-account'

const subject = shallow(
  <IconAccount />
)

describe('IconAccount', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
