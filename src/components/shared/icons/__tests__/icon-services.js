import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-services')
import IconServices from '../icon-services'

const subject = shallow(
  <IconServices />
)

describe('IconServices', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
