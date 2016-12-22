import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon-integration')
import IconIntegration from '../icon-integration'

const subject = shallow(
  <IconIntegration className="foo" />
)

describe('IconIntegration', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
