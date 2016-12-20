import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-server-error')
import IconServerError from '../icon-server-error'

const subject = shallow(
  <IconServerError className="foo" />
)

describe('IconServerError', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
