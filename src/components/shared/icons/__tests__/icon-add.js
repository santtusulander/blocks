import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-add')
import IconAdd from '../icon-add'

const subject = shallow(
  <IconAdd />
)

describe('IconAdd', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
