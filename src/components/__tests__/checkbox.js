import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../checkbox')
import Checkbox from '../checkbox'

const subject = shallow(
  <Checkbox />
)

describe('Checkbox', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
