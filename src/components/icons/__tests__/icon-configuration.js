import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-configuration')
import IconConfiguration from '../icon-configuration'

const subject = shallow(
  <IconConfiguration />
)

describe('IconConfiguration', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
