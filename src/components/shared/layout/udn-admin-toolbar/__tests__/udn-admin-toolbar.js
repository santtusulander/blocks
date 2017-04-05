import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../udn-admin-toolbar')
import UdnAdminToolbar from '../udn-admin-toolbar'

const subject = shallow(
  <UdnAdminToolbar />
)

describe('UdnAdminToolbar', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
