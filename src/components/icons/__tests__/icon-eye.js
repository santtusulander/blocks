import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-eye')
import IconEye from '../icon-eye'

const subject = shallow(
  <IconEye />
)

describe('IconEye', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
