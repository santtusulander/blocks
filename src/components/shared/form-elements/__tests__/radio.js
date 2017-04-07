import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../radio')
import Radio from '../radio'

const subject = shallow(
  <Radio />
)

describe('Radio', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
