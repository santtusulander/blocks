import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-mtr')
import IconMtr from '../icon-mtr'

const subject = shallow(
  <IconMtr />
)

describe('IconMtr', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
