import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-core-marker')
import IconCoreMarker from '../icon-core-marker'

const subject = shallow(
  <IconCoreMarker />
)

describe('IconCoreMarker', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
