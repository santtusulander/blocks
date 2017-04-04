import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-alerts')
import IconAlerts from '../icon-alerts'

const subject = shallow(
  <IconAlerts />
)

describe('IconAlerts', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
