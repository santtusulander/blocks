import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-export')
import IconExport from '../icon-export'

const subject = shallow(
  <IconExport />
)

describe('IconExport', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
