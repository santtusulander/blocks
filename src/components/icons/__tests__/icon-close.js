import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-close')
import IconClose from '../icon-close'

const subject = shallow(
  <IconClose />
)

describe('IconClose', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
