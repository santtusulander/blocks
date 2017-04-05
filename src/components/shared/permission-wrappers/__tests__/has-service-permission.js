import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../has-service-permission')
import HasServicePermission from '../has-service-permission'

const subject = shallow(
  <HasServicePermission
    servicePermissions={Immutable.List()}>
    <div />
  </HasServicePermission>
)

describe('HasServicePermission', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
