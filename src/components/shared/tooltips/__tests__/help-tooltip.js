import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../help-tooltip')
import HelpTooltip from '../help-tooltip'

const subject = shallow(
  <HelpTooltip id='tooltipId' />
)

describe('HelpTooltip', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
