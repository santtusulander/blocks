import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-sp-marker')
import IconSpMarker from '../icon-sp-marker'

const subject = shallow(
  <IconSpMarker />
)

describe('IconSpMarker', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
