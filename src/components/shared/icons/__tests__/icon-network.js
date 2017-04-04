import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-network')
import IconNetwork from '../icon-network'

const subject = shallow(
  <IconNetwork />
)

describe('IconNetwork', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
