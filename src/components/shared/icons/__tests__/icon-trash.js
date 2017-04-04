import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-trash')
import IconTrash from '../icon-trash'

const subject = shallow(
  <IconTrash />
)

describe('IconTrash', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
