import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-question')
import IconQuestion from '../icon-question'

const subject = shallow(
  <IconQuestion className="foo" />
)

describe('IconQuestion', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
