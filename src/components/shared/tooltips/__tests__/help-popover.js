import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../help-popover')
import HelpPopover from '../help-popover'

const subject = shallow(
  <HelpPopover id='tooltipId' />
)

describe('HelpPopover', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
