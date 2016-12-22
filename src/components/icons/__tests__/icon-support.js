import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-support')
import IconSupport from '../icon-support'

const subject = shallow(
  <IconSupport />
)

describe('IconSupport', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
