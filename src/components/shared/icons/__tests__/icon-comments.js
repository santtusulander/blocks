import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-comments')
import IconComments from '../icon-comments'

const subject = shallow(
  <IconComments className="foo" />
)

describe('IconComments', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
