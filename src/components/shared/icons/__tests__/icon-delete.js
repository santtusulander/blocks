import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-delete')
import IconDelete from '../icon-delete'

const subject = shallow(
  <IconDelete />
)

describe('IconDelete', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
