import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-check')
import IconCheck from '../icon-check'

const subject = shallow(
  <IconCheck />
)

describe('IconCheck', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
