import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-ericsson')
import IconEricsson from '../icon-ericsson'

const subject = shallow(
  <IconEricsson />
)

describe('IconEricsson', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
