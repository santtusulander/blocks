import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../button-disable-tooltip')
import ButtonDisableTooltip from '../button-disable-tooltip'

const tooltipId = "tooltip-help"

const subject = shallow(
  <ButtonDisableTooltip tooltipId={tooltipId} />
)

describe('ButtonDisableTooltip', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
