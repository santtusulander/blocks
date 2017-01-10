import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../key-stroke-decorator')
import KeyStrokeSupport from '../key-stroke-decorator'

const WrappedComponent = () => <FakeComponent />
const WithKeyStrokeSupportComponent = KeyStrokeSupport(WrappedComponent)

const subject = shallow(
  <WithKeyStrokeSupportComponent cancel={()=>{}} />
)

describe('KeyStrokeSupport', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
