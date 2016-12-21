import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../select-auto-close')
import AutoClose from '../select-auto-close'

const WrappedComponent = () => <FakeComponent />
const AutoClosingComponent = AutoClose(WrappedComponent)

const subject = shallow(
  <AutoClosingComponent />
)

describe('AutoClose', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
