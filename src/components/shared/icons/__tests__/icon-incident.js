import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-incident')
import IconIncident from '../icon-incident'

const subject = shallow(
  <IconIncident className="foo" />
)

describe('IconIncident', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
