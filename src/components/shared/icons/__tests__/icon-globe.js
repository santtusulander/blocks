import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-globe')
import IconGlobe from '../icon-globe'

const subject = shallow(
  <IconGlobe />
)

describe('IconGlobe', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
