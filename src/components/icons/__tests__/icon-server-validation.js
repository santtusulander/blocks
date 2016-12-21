import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-server-validation')
import IconValidation from '../icon-server-validation'

const subject = shallow(
  <IconValidation className="foo" />
)

describe('IconValidation', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
