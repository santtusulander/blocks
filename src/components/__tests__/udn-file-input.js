import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../udn-file-input')
import UDNFileInput from '../udn-file-input'

const subject = shallow(
  <UDNFileInput id='id' />
)

describe('UDNFileInput', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
