import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-file')
import IconFile from '../icon-file'

const subject = shallow(
  <IconFile />
)

describe('IconFile', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
