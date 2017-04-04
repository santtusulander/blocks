import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-minimap')
import IconMinimap from '../icon-minimap'

const subject = shallow(
  <IconMinimap />
)

describe('IconMinimap', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
