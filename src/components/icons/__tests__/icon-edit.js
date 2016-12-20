import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-edit')
import IconEdit from '../icon-edit'

const subject = shallow(
  <IconEdit />
)

describe('IconEdit', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
